from http.server import BaseHTTPRequestHandler, HTTPServer
from io import StringIO
import sys
from textgenrnn import textgenrnn

class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self
    def __exit__(self, *args):
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio
        sys.stdout = self._stdout


textgen=textgenrnn('6000.hdf5')

class Server(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def do_POST(self):
        content_len = int(self.headers.get('content-length', 0))
        post_body = self.rfile.read(content_len)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(predict(post_body.decode('utf-8')))

    def do_OPTIONS(self):
        self.send_response(200)       
        self.send_header('Access-Control-Allow-Origin', '*')                
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.do_POST()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
        

def predict(inp):
    words = inp.split(' ')
    out = words[0] + ' '
    text_so_far = ""
    for w in words:
        text_so_far += w + ' '
        with Capturing() as outtext:
            textgen.generate(prefix=text_so_far)
        out += str(outtext).split(' ')[-1] + ' '
    print(bytes(str(out).encode('utf-8')))
    return bytes(str(out).encode('utf-8'))
    pass

def run():
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, Server)
    print('running server...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

if __name__ == "__main__":
    run()
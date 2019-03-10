const label = document.getElementById('label');

const LOADING_TEXTS = [
    'colluding with Russia',
    'generating Big Dick Energy',
    'paying off pornstars',
    'asserting Chungal Dominance'
]


function randInt(range) {
    return Math.floor(Math.random() * range);
}

function POST(str) {
    return new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/", true);
        xhr.send(str);

        xhr.onload = () => {
            res(xhr.responseText);
        }
    });
}

function getTweet(str) {
    label.textContent = 'Please wait... ' + LOADING_TEXTS[randInt(LOADING_TEXTS.length)] + '...';
    POST(str).then(text => {
        console.log(text);
        label.textContent = text;
    });
}
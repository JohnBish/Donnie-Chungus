with open('data.txt', 'r') as f:
    with open('data-truncated1.txt', 'w') as f1:
        for i in range(2000):
            try:
                f1.write(f.readline())
            except Exception:
                pass
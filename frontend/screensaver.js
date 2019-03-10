class Sprite{
    constructor(width, height, pos, vel, img, rotateColor=true) {
        this.width = width;
        this.height = height;
        this.pos = pos;
        this.vel = vel;
        this.angle = Math.ceil(Math.random() * 359);
        this.angVel = Math.random() * 5;

        this.image = new Image;
        this.image.src = img;
        this.rotateColor = rotateColor;

        this.corners = this.calcCorners();
    }

    calcCorners() {
        var corners = [
            {x: 0, y: 0},
            {x: this.width, y: 0},
            {x: this.width, y: this.height},
            {x: 0, y: this.height}
        ];
        
        const theta = this.angle * Math.PI/180;
        for (var i=0; i<4; i++) {
            corners[i].x -= this.width / 2;
            corners[i].y -= this.height / 2;
            const tempX = corners[i].x;
            corners[i].x = corners[i].x * Math.cos(theta) - corners[i].y * Math.sin(theta);
            corners[i].y = tempX * Math.sin(theta) + corners[i].y * Math.cos(theta);
            corners[i].x += this.width / 2;
            corners[i].y += this.height / 2;
        }
        return corners;
    }

    update() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        if (this.pos.x < this.width) {
            this.vel.x = Math.abs(this.vel.x);
        } else if (this.pos.x + this.width > canvas.width) {
            this.vel.x = -Math.abs(this.vel.x);
        }
        if (this.pos.y < this.height) {
            this.vel.y = Math.abs(this.vel.y);
        } else if (this.pos.y + this.height > canvas.height) {
            this.vel.y = -Math.abs(this.vel.y);
        }
    }

    draw(ctx) {
        if (this.rotateColor) {
            ctx.filter = 'hue-rotate(' + this.angle + 'deg)';
        }
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle * Math.PI/180);
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
        ctx.restore();
        ctx.filter = 'none';
    }
}

function cls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    cls();
    for (var i=0; i<sprites.length; i++) {
        sprites[i].update();
        sprites[i].angle += 2;
        sprites[i].draw(ctx);
    }
    requestAnimationFrame(update);
}


var canvas = document.getElementById('angery-fuck');
var ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
window.onresize = e => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
}

sprites = [];
for (var i=0; i<10; i++) {
    const size = Math.random() * 50 + 90;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const velX = Math.random() * 8 + 1;
    const velY = Math.random() * 8 + 1;
    sprites.push(new Sprite(40, 60, {x: x, y: y}, {x: velX, y: velY}, 'img/gold-dollar.png', rotateColor=false));
}
for (var i=0; i<5; i++) {
    const size = Math.random() * 50 + 90;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const velX = Math.random() * 8 + 1;
    const velY = Math.random() * 8 + 1;
    sprites.push(new Sprite(size, size, {x: x, y: y}, {x: velX, y: velY}, 'img/angery-fuck.png'));
}
update();
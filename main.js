const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_W = canvas.width = 800;
const CANVAS_H = canvas.height = 800;

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

class Player{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 40;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.vg = 0.5;
        this.jumpStrength = -15;
        this.isJumping = false;
        this.speed = 8;
    }
    draw(){
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'red';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x + 10, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + this.width - 15, this.y + 5, this.width / 5, this.height / 5);
        ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, this.height / 5);
    }
    update(){
        // 落下処理
        this.vy += this.vg;
        this.x += this.vx;
        this.y += this.vy;
        //キー操作
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
            this.vx = -this.speed;
            } else if (event.key === 'ArrowRight') {
            this.vx = this.speed;
            } else if (event.key === 'ArrowUp' && !this.isJumping) {
            this.vy = this.jumpStrength;
            this.isJumping = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.vx = 0;
            }
        });
    }    
    checkCollision(box){
            if(
                this.x + this.width > box.x &&
                this.x < box.x + box.width &&
                this.y + this.height > box.y &&
                this.y < box.y + box.height &&
                this.vy >= 0
            ){  
                this.y = box.y - this.height;
                this.vy = 0;
                this.isJumping = false;
            }
        }
}

class Box {
    constructor(x,y,width,height) {
        this.width = width;
        this.height = height;        
        this.x = x;
        this.y = y-this.height;
        this.vx = 1;
        this.vy = 1;
    }
    draw() {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    update() {
        this.x += Math.sin(this.vx) * 2;
        this.vx += 0.01;
        this.y += Math.cos(this.vy) * 1;
        this.vy += 0.01;
        
    }
}


const player = new Player();
const box1 = new Box(0,CANVAS_H/2,400,20);
const box2 = new Box(500,CANVAS_H/2-100,200,20);




// ゲームループ
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_W,CANVAS_H);
    player.draw();
    player.update();
    player.checkCollision(box1);
    player.checkCollision(box2);

    box1.draw();
    box2.draw();
    box1.update();
    box2.update();

    requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);

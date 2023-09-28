// HTMLからキャンバス要素を取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const C_W = canvas.width = 600;
const C_H = canvas.height = 800;

const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

class Circle {
    constructor(size, x, y, vx, vy) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.gravity = 0.5; // 重力の強さ
        this.bounce = -0.6; // 跳ね返り係数
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }
    update() {
        this.vy += this.gravity; // 重力を適用
        this.x += this.vx;
        this.y += this.vy;

        // キャンバスの境界に衝突したら跳ね返る
        this.checkBoundaryCollision();
    }
    
    checkBoundaryCollision() {
        if (this.x - this.size < 0 || this.x + this.size > C_W) {
            this.vx *= this.bounce;
        }
        if (this.y - this.size < 0 || this.y + this.size > C_H) {
            this.vy *= this.bounce;
            this.y = Math.min(Math.max(this.size, this.y), C_H - this.size); // キャンバス内にクリップ
        }
    }

    // 円同士の当たり判定
    checkCircleCollision(otherCircle) {
        const dx = this.x - otherCircle.x;
        const dy = this.y - otherCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.size + otherCircle.size;
    }

    // 円同士の衝突処理
    handleCircleCollision(otherCircle) {
        // 衝突時に速度を反転させる
        this.vx *= this.bounce;
        this.vy *= this.bounce;
        otherCircle.vx *= this.bounce;
        otherCircle.vy *= this.bounce;

        // 円同士が重なった際に、少しずつ移動して重なりを解消
        const dx = this.x - otherCircle.x;
        const dy = this.y - otherCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = (this.size + otherCircle.size) - distance;
        const moveX = (dx / distance) * overlap * 0.5;
        const moveY = (dy / distance) * overlap * 0.5;

        this.x += moveX;
        this.y += moveY;
        otherCircle.x -= moveX;
        otherCircle.y -= moveY;
    }
}

// ゲームオブジェクトの壁に対する当たり判定と衝突処理
function checkWallCollision(object) {
    if (object.x - object.size < 0 || object.x + object.size > C_W) {
        object.vx *= object.bounce;
    }
    if (object.y - object.size < 0 || object.y + object.size > C_H) {
        object.vy *= object.bounce;
        object.y = Math.min(Math.max(object.size, object.y), C_H - object.size); // キャンバス内にクリップ
    }
}

let circles = [];
for (let i = 0; i < 1000; i++) {
    const circle = new Circle(rand(1, 20), rand(20, C_W - 20), rand(20, C_H - 20), rand(-5, 5), rand(-5, 5));
    circles.push(circle);
    circle.draw();
}

// ゲームループ
function gameLoop() {
    ctx.clearRect(0, 0, C_W, C_H); // キャンバスをクリア

    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        circle.update(); // 円の位置を更新
        circle.draw(); // 円を描画

        // 円同士の当たり判定
        for (let j = i + 1; j < circles.length; j++) {
            if (circle.checkCircleCollision(circles[j])) {
                // 円同士の衝突処理をここに記述
                circle.handleCircleCollision(circles[j]);
            }
        }

        // ゲームオブジェクトと壁の当たり判定
        checkWallCollision(circle);
    }

    requestAnimationFrame(gameLoop); // 次のフレームを要求
}

// 最初のフレームを開始
requestAnimationFrame(gameLoop);

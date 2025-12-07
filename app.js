"use strict;"

let canvas; // キャンバス要素
let ctx; // コンテキスト

let isAnimating = true; // アニメーションの状態
let time = 0; // 時間
let rotationAmplitude = 40; // 回転の振幅
let verticalAmplitude = 2; // 上下移動の振幅
let speed = 8; // 振動の速度
let pivotPosition = 0.2; // 支点の位置 (0〜1)

const pencilLength = 280; // 鉛筆の長さ
const pencilWidth = 14; // 鉛筆の幅

window.addEventListener('load', () => {
    // 初期値の表示
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // コントロールの設定
    document.getElementById('rotationAmplitude').addEventListener('input', (e) => {
        rotationAmplitude = parseInt(e.target.value);
        document.getElementById('rotationAmplitudeValue').textContent = rotationAmplitude;
    });

    document.getElementById('verticalAmplitude').addEventListener('input', (e) => {
        verticalAmplitude = parseInt(e.target.value);
        document.getElementById('verticalAmplitudeValue').textContent = verticalAmplitude;
    });

    document.getElementById('speed').addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        document.getElementById('speedValue').textContent = speed;
    });

    document.getElementById('pivot').addEventListener('input', (e) => {
        pivotPosition = parseInt(e.target.value) / 100;
        document.getElementById('pivotValue').textContent = e.target.value;
    });

    document.getElementById('toggleBtn').addEventListener('click', () => {
        isAnimating = !isAnimating;
        document.getElementById('toggleBtn').textContent = isAnimating ? '一時停止' : '再生';
        if (isAnimating) animate();
    });
    // 初期描画
    animate();
});



function drawPencil() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 支点の上下移動
    const verticalOffset = Math.sin(time) * verticalAmplitude;
    
    // 支点の位置
    const pivotX = centerX - pencilLength / 2 + pencilLength * pivotPosition;
    const pivotY = centerY + verticalOffset;
    
    // 回転角度
    const rotationAngle = (Math.sin(time) * rotationAmplitude) / 200;
    
    ctx.save();
    
    // 支点を中心に回転
    ctx.translate(pivotX, pivotY);
    ctx.rotate(rotationAngle);
    ctx.translate(-pivotX, -pivotY);
    
    // 鉛筆の開始位置と終了位置
    const startX = centerX - pencilLength / 2;
    const endX = centerX + pencilLength / 2;
    const y = centerY + verticalOffset;
    
    // 鉛筆本体（木の部分）
    ctx.fillStyle = '#486A49';
    ctx.fillRect(startX, y - pencilWidth / 2, pencilLength * 0.85, pencilWidth);
    
    // 芯の部分（先端）
    ctx.beginPath();
    ctx.fillStyle = '#CC947C';
    const tipStart = startX + pencilLength * 0.85;
    ctx.moveTo(tipStart, y - pencilWidth / 2);
    ctx.lineTo(tipStart, y + pencilWidth / 2);
    ctx.lineTo(endX, y);
    ctx.closePath();
    ctx.fill();
    
    // 芯の先端（黒）
    ctx.beginPath();
    ctx.fillStyle = '#222';
    ctx.moveTo(tipStart + (endX - tipStart) * 0.6, y - pencilWidth / 6);
    ctx.lineTo(tipStart + (endX - tipStart) * 0.6, y + pencilWidth / 6);
    ctx.lineTo(endX, y);
    ctx.closePath();
    ctx.fill();
    
    // 消しゴム部分
    ctx.fillStyle = '#BC6241';
    ctx.fillRect(startX, y - pencilWidth / 2, pencilLength * 0.075, pencilWidth);
    
    // 金属バンド
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(startX + pencilLength * 0.075, y - pencilWidth / 2 - 1, pencilLength * 0.03, pencilWidth + 2);
    
    // 木目の線
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        const lineY = y - pencilWidth / 2 + (i + 1) * (pencilWidth / 4);
        ctx.beginPath();
        ctx.moveTo(startX + pencilLength * 0.11, lineY);
        ctx.lineTo(startX + pencilLength * 0.85, lineY);
        ctx.stroke();
    }
    
    ctx.restore();
    
    // 支点を示す手（指）を描画
    ctx.save();
    ctx.fillStyle = '#FFD7B5';
    ctx.strokeStyle = '#CC9966';
    ctx.lineWidth = 2;
    
    // 親指
    ctx.beginPath();
    ctx.ellipse(pivotX - 15, pivotY - 25, 12, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 人差し指
    ctx.beginPath();
    ctx.ellipse(pivotX + 15, pivotY + 25, 12, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
}

function animate() {
    if (!isAnimating) return;
    
    time += speed * 0.02;
    drawPencil();
    
    requestAnimationFrame(animate);
}


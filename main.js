const woop = new Audio('woop.wav');
canvas = document.getElementById("myCanvas")
ctx = canvas.getContext("2d") // toolbox (context = toolbox)

var player1 = {
    lives: 10,
    score: 0,
}

var player2 = {
    lives: 10,
    score: 0,
}

var obj = { // cube
    x: 400, // start pos
    y: 400,
    w: 10,
    h: 10,
    deltaX: 2,
    deltaY: 1.5,
}

var env = {
    rows: 20,
    columns: 20,
}

var paddle1 = {
    x: 40,
    y: 80,
    w: canvas.width * 0.02,
    h: canvas.height * 0.2,
}

var paddle2 = {
    x: 745,
    y: canvas.height - 240,
    w: canvas.width * 0.02,
    h: canvas.height * 0.2,
}

function gameLogic() {
    // movement
    obj.x += obj.deltaX;
    obj.y += obj.deltaY;

    // bounce off top/bottom
    if (obj.y > canvas.height - 5 || obj.y < 0)
        obj.deltaY = -obj.deltaY;

    // collision
    let coll = intersect(obj, paddle1)
    let coll2 = intersect(obj, paddle2)

    if (coll || coll2) {
        woop.play();
        obj.deltaX = -obj.deltaX * 1.25;
        obj.deltaY = obj.deltaY * 1.25;
    }

    // point for PLAYER 1
    if (obj.x > canvas.width + 20) {
        player1.score += 1;
        player2.lives -= 1;
        obj.deltaX = -Math.random() - 1;
        obj.deltaY = -Math.random() - 1;
        obj.x = 400 - 5; // middle - width
        obj.y = 400 - 5; // middle - height
        document.getElementById("score1").innerHTML = "Score = " + player1.score;
        document.getElementById("lives2").innerHTML = "Lives = " + player2.lives;
    }

    // point for PLAYER 2
    if (obj.x < -20) {
        player2.score += 1;
        player1.lives -= 1;
        obj.deltaX = Math.random() + 1;
        obj.deltaY = Math.random() + 1;
        obj.x = 400 - 5; // middle - width
        obj.y = 400 - 5; // middle - height
        document.getElementById("score2").innerHTML = "Score = " + player2.score;
        document.getElementById("lives1").innerHTML = "Lives = " + player1.lives;
    }

    // limits 
    if (paddle1.y >= 640) {
        paddle1.y = 640;
    }
    if (paddle1.y <= 0) {
        paddle1.y = 0;
    }
    if (paddle2.y >= 640) {
        paddle2.y = 640;
    }
    if (paddle2.y <= 0) {
        paddle2.y = 0;
    }
    // gameover state
    if (player1.score == 10) {
        gameover();
        document.getElementById("win").innerHTML = "Game Over. Player 1 Wins.";
    }
    else if (player2.score == 10) {
        gameover();
        document.getElementById("win").innerHTML = "Game Over. Player 2 Wins.";
    }
}

function cyclic() {
    draw();     // draw everything, no matter how tiny the change to the picture   
    gameLogic();
}

function start() {
    canvas.setAttribute('tabindex', '0');
    canvas.focus(); // divert keyboard to the canvas
    // canvas.addEventListener('mousedown', f_mousedown, false);
    canvas.addEventListener('keypress', f_keypress1, false);
    canvas.addEventListener('keypress', f_keypress2, false);
    setInterval(cyclic, 15); // do game Logic periodically
}

function f_keypress1(e) {
    console.log("key=" + e.code);
    if (e.code == "KeyW")
        paddle1.y -= 40;
    if (e.code == "KeyS")
        paddle1.y += 40;
}

function f_keypress2(e) {
    console.log("key=" + e.code);
    if (e.code == "KeyO")
        paddle2.y -= 40;
    if (e.code == "KeyL")
        paddle2.y += 40;
}

function gameover() {
    obj.deltaX = 0;
    obj.deltaY = 0;
    obj.x = 400 - 5; // middle - width
    obj.y = 400 - 5; // middle - height
}

function intersect(o, p) {
    if (o.x + o.w < p.x)
        return false; // o entirely left of p
    if (o.y + o.h < p.y)
        return false; // o above p
    if (p.x + p.w < o.x)
        return false; // p entirely left of o
    if (p.y + p.h < o.y)
        return false; // p above o
    return true;
}

function draw() {
    canvas.width = canvas.width; // delete everything
    drawGrid();
    drawPaddle1();
    drawPaddle2();
    drawObj();
}

function drawPaddle1() {
    ctx.fillStyle = "darkred";
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
}

function drawPaddle2() {
    ctx.fillStyle = "darkgreen";
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
}

function drawGrid() {
    ctx.fillStyle = "#ccc";
    ctx.lineWidth = 0.1;

    for (let i = 0; i <= env.rows; i++) {
        ctx.moveTo(0, i * (canvas.height / env.rows));
        ctx.lineTo(canvas.width, i * (canvas.height / env.rows));
    }
    for (let i = 0; i <= env.columns; i++) {
        ctx.moveTo(i * (canvas.width / env.columns), 0);
        ctx.lineTo(i * (canvas.width / env.columns), canvas.height);
    }
    ctx.stroke();
}

function drawObj() {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "ghostwhite";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    // ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

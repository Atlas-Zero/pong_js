<script>

    const canvas = document.getElementById("myCanvas")
    // const woop = new Audio('woop.wav')

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
        deltaX: 1.5,
        deltaY: 1,
    }

    var env = {
        rows: 20,
        columns: 20,
        c: null, // our canvas
        ctx: null, // 2d-context 
    }

    var paddle1 = {
        x: 40,
        y: 100,
        w: canvas.width * 0.02,
        h: canvas.height * 0.2,
    }

    var paddle2 = {
        x: 745,
        y: 550,
        w: canvas.width * 0.02,
        h: canvas.height * 0.2,
    }

    function gameLogic() {
        // movement
        obj.x += obj.deltaX;
        obj.y += obj.deltaY;

        // bounce off top/bottom
        if (obj.y > env.c.height - 10 || obj.y < 0)
            obj.deltaY = -obj.deltaY;

        // collision
        let coll = intersect(obj, paddle1) 
        let coll2 = intersect(obj, paddle2)

        if (coll || coll2) {
            // woop.play();
            obj.deltaX = -obj.deltaX * 1.25;
            obj.deltaY = obj.deltaY * 1.25;
        }

        // point for PLAYER 1
        if (obj.x > env.c.width + 20) {
            player1.score += 1;
            player2.lives -= 1;
            obj.deltaX = -Math.random() - 1;
            obj.deltaY = -Math.random() - 1;
            obj.x = 400 - 10; // middle - width
            obj.y = 400 - 10; // middle - height
            document.getElementById("score1").innerHTML = "Score = " + player1.score;
            document.getElementById("lives2").innerHTML = "Lives = " + player2.lives;
        }

        // point for PLAYER 2
        if (obj.x < -20) {
            player2.score += 1;
            player1.lives -= 1;
            obj.deltaX = Math.random() + 1;
            obj.deltaY = Math.random() + 1;
            obj.x = 400 - 10; // middle - width
            obj.y = 400 - 10; // middle - height
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
        gameLogic();
        draw();     // draw everything, no matter how tiny the change to the picture   
    }

    function start() {
        env.c = document.getElementById("myCanvas"); // get canvas element and store reference globally
        env.c.setAttribute('tabindex', '0');
        env.c.focus(); // divert keyboard to the canvas
        // canvas.addEventListener('mousedown', f_mousedown, false);
        env.c.addEventListener('keypress', f_keypress1, false);
        env.c.addEventListener('keypress', f_keypress2, false);
        env.ctx = env.c.getContext("2d"); // same thing for the toolbox (context = toolbox)
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
        obj.x = 400 - 10; // middle - width
        obj.y = 400 - 10; // middle - height
    }

    function intersect(R1, R2) {
        if (R1.x + R1.w < R2.x)
            return false; // R1 entirely left of R2
        if (R1.y + R1.h < R2.y)
            return false; // R1 above R2
        if (R2.x + R2.w < R1.x)
            return false; // R2 entirely left of R1
        if (R2.y + R2.h < R1.y)
            return false; // R2 above R1
        return true;
    }
    
    function draw() {
        // var c = document.getElementById("myCanvas");
        env.c.width = env.c.width; // delete everything
        drawGrid();
        drawPaddle1();
        drawPaddle2();
        drawObj();
    }

    function drawPaddle1() {
        env.ctx.fillStyle = "darkred";
        env.ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
    }

    function drawPaddle2() {
        env.ctx.fillStyle = "darkgreen";
        env.ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
    }

    function drawGrid() {
        env.ctx.fillStyle = "#ccc";
        env.ctx.lineWidth = 0.1;

        for (var i = 0; i <= env.rows; i++) {
            env.ctx.moveTo(0, i * (env.c.height / env.rows));
            env.ctx.lineTo(env.c.width, i * (env.c.height / env.rows));
        }
        for (var i = 0; i <= env.columns; i++) {
            env.ctx.moveTo(i * (env.c.width / env.columns), 0);
            env.ctx.lineTo(i * (env.c.width / env.columns), env.c.height);
        }
        env.ctx.stroke();
    }

    function drawObj() {
        env.ctx.fillStyle = "ghostwhite";
        env.ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    }

</script>

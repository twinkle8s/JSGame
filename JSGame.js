$(document).ready(function() {
	// create canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 700;
	canvas.height = 500;
	document.getElementById("game_area").appendChild(canvas);
	
	//original value
	var start = false, end = false;
	var start_btn = new componentRect(290, 210, 120, 80, "blue");
	var start_word = new text("START", 300, 260);
	var players = [null, null, null];
	const RED = true, BLACK = false;
	var ghost = 0, human1 = 0, human2 = 0;
	var time = 0;
	var message, end_message;

	//update
	setInterval(draw, 10);
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (!start) {
			start_btn.update();
			start_word.update();
		}
		else if (!end) {
			//players move
			players[0].newPos();
			players[0].update();
			players[1].newPos();
			players[1].update();
			players[2].newPos();
			players[2].update();
			//30 seconds
			time += 10;
			timezone();
			//if someone win
			endGame();
		}
		else {
			end_message.update();
			message.update();
		}
	}
	
	//component rectangle
	function componentRect(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.update = function() {
			ctx.shadowBlur = 20;
			ctx.shadowColor = "black";
			ctx.fillStyle = color;
			ctx.fillRect(x, y, width, height);
		}
	}

	//words
	function text(word, x, y) {
		this.word = word;
		this.x = x;
		this.y = y;
		this.update = function() {
			ctx.shadowBlur = 0;
			ctx.font = "30px Arial";
			ctx.fillStyle = "white";
			ctx.fillText(word, x, y);
		}
	}

	//player object
	function player(x, y, name) {
		this.x = x;
		this.y = y;
		this.color = BLACK;
		this.name = name;
		this.speedX = 0;
		this.speedY = 0;
		this.update = function() {
			ctx.shadowBlur = 0;
			ctx.beginPath();
			if (this.color == RED) {
				ctx.fillStyle = "red";
			}
			else {
				ctx.fillStyle = "black";
			}
			ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
			ctx.fill();
			ctx.font = "20px Arial";
			ctx.fillText(this.name, this.x-35, this.y-20);
		}
		this.newPos = function() {
			if ((this.x+this.speedX)>=40 && (this.x+this.speedX)<(canvas.width-40))
				this.x += this.speedX;
			if ((this.y+this.speedY)>=40 && (this.y+this.speedY)<(canvas.height-10))
				this.y += this.speedY;
		}
	}

	function createPlayers() {
		players[0] = new player(350, 150, "Player 1");
		players[1] = new player(200, 350, "Player 2");
		players[2] = new player(500, 350, "Player 3");
		ghost = whoIsGhost();
	}

	function whoIsGhost() {
		var ran = Math.floor(Math.random() * 3);
		if (ran == 0) {
			players[0].color = RED;
			players[1].color = BLACK;
			human1 = 1;
			players[2].color = BLACK;
			human2 = 2;
		}
		else if (ran == 1) {
			players[0].color = BLACK;
			human1 = 0;
			players[1].color = RED;
			players[2].color = BLACK;
			human2 = 2;
		}
		else {
			players[0].color = BLACK;
			human1 = 0;
			players[1].color = BLACK;
			human2 = 1;
			players[2].color = RED;
		}
		return ran;
	}

	function timezone() {
		var t = time/1000; //seconds
		if (t>0 && (t%30)==0) {
			var temp;
			do {
				temp = whoIsGhost();
			}
			while (ghost == temp)
			ghost = temp;
		}
	}

	function endGame() {
		var xx = players[human1].x - players[ghost].x;
		var yy = players[human1].y - players[ghost].y;
		var distance = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2));
		if (distance<=20) {
			end = true;
			var msg = players[ghost].name+" catches "+players[human1].name+" !!!";
			end_message = new componentRect(150, 210, 400, 80, "green");
			message = new text(msg, 165, 260);
		}
		xx = players[human2].x - players[ghost].x;
		yy = players[human2].y - players[ghost].y;
		distance = Math.sqrt(Math.pow(xx,2)+Math.pow(yy,2));
		if (distance<=20) {
			end = true;
			var msg = players[ghost].name+" catches "+players[human2].name+" !!!";
			end_message = new componentRect(150, 210, 400, 80, "green");
			message = new text(msg, 165, 260);
		}
	}

	//mouse click start
	$("canvas").click(function(e) {
		console.log("click: "+e.offsetX+"/"+e.offsetY);
		if (!start && e.offsetX>=start_btn.x && e.offsetX<=(start_btn.x+start_btn.width) && e.offsetY>=start_btn.y && e.offsetY<=(start_btn.y+start_btn.height)) {
			start = true;
			createPlayers();
		}
	});

	//player move (key)
	$(document).keydown(function(e) {
		//Player 1
		if (e.keyCode == 65) players[0].speedX = -1;
		if (e.keyCode == 68) players[0].speedX = 1;
		if (e.keyCode == 87) players[0].speedY = -1;
		if (e.keyCode == 83) players[0].speedY = 1;
		//Player 2
		if (e.keyCode == 72) players[1].speedX = -1;
		if (e.keyCode == 75) players[1].speedX = 1;
		if (e.keyCode == 85) players[1].speedY = -1;
		if (e.keyCode == 74) players[1].speedY = 1;
		//Player 3
		if (e.keyCode == 37) players[2].speedX = -1;
		if (e.keyCode == 39) players[2].speedX = 1;
		if (e.keyCode == 38) players[2].speedY = -1;
		if (e.keyCode == 40) players[2].speedY = 1;
	})

	$(document).keyup(function(e) {
		//Player 1
		if (e.keyCode == 65) players[0].speedX = 0;
		if (e.keyCode == 68) players[0].speedX = 0;
		if (e.keyCode == 87) players[0].speedY = 0;
		if (e.keyCode == 83) players[0].speedY = 0;
		//Player 2
		if (e.keyCode == 72) players[1].speedX = 0;
		if (e.keyCode == 75) players[1].speedX = 0;
		if (e.keyCode == 85) players[1].speedY = 0;
		if (e.keyCode == 74) players[1].speedY = 0;
		//Player 3
		if (e.keyCode == 37) players[2].speedX = 0;
		if (e.keyCode == 39) players[2].speedX = 0;
		if (e.keyCode == 38) players[2].speedY = 0;
		if (e.keyCode == 40) players[2].speedY = 0;
	})
});
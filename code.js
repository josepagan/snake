class Pixel {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  constructor(x = 0, y = 0, color = 'white') {
    this.body = [new Pixel(x, y)]
    this.color = 'white';
    this.dir;

  }

  // get snakeArrayLength(){
  // return this.body.length;
  // }

  get snakeHeadPos() {
    return this.body[this.body.length - 1]
  }

  get snakeRestBodyPos() {
    return this.body.slice(0, -1);
  }


  get newHeadPosX() {
    if (this.dir == "RIGHT") {
      return this.snakeHeadPos.x + 1
    } else if (this.dir == "LEFT") {
      return this.snakeHeadPos.x - 1
    } else return this.snakeHeadPos.x
  }
  get newHeadPosY() {
    if (this.dir == "UP") {
      return this.snakeHeadPos.y - 1
    } else if (this.dir == "DOWN") {
      return this.snakeHeadPos.y + 1
    } else return this.snakeHeadPos.y
  }


  move() {
    this.body.push(new Pixel(this.newHeadPosX, this.newHeadPosY));
    this.body.shift();
  }


  grow() {
    this.body.push(new Pixel(this.newHeadPosX, this.newHeadPosY));
  }
}


class Food {
  constructor(x = 0, y = 0) {
    this.pos = new Pixel(x, y);
    this.color = 'red';
  }
}


class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._gameOver = false;
    this._score = 0;
    this._hiScore = 0;
    scoreBoard.textContent = this._score;
    hiScoreBoard.textContent = this._hiScore;

    this.snake = new Snake(10, 10);
    this.apple = new Food(Math.floor((Math.random() * this._canvas.width)), Math.floor((Math.random() * this._canvas.height)));
    this.snake.dir = 'RIGHT';
    this._justEaten



    // this._refresh = setInterval(this.loop.bind(this), 1000 / 60 * 8)
    this._refresh = setInterval(() => {this.loop()}, 1000 / 60 * 8)
    this._frame = 0;


  }

  reStart() {
    this._gameOver = false;
    console.log("restart triggered");
    canvas.style.backgroundColor = "gray";
    this._score = 0;
    scoreBoard.textContent = this._score;
    this.snake.body = [{x:10,y:10}];
    this._refresh = setInterval(() => {this.loop()}, 1000 / 60 * 8)
  }

  gameOver() {

    clearInterval(this._refresh);
    this._context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.backgroundColor = "red";
    console.log("hold screen for restart");
  }

  drawFood(obj) {
    this._context.fillStyle = obj.color;
    this._context.fillRect(obj.pos.x, obj.pos.y, 1, 1);
  }

  drawSnake(obj) {
    this._context.fillStyle = obj.color;
    this.snake.body.forEach(part => this._context.fillRect(part.x, part.y, 1, 1))
  }
//big arse collision function. I know I should split it, make it clever. Some day.
  collide() {
    //food collision
    if (this.snake.snakeHeadPos.x === this.apple.pos.x && this.snake.snakeHeadPos.y === this.apple.pos.y) {
      console.log("OMG")
      this._score++;
      if (this._score > this._hiScore) {
        this._hiScore = this._score;
      }
      scoreBoard.textContent = this._score;
      hiScoreBoard.textContent = this._hiScore;

      this.apple = new Food(Math.floor((Math.random() * this._canvas.width)), Math.floor((Math.random() * this._canvas.height)));
      this._justEaten = true;
    }
    //snake colliding with its body
    for (let element of this.snake.snakeRestBodyPos) {
      let x = element.x;
      let y = element.y
      if (x == this.snake.snakeHeadPos.x && y == this.snake.snakeHeadPos.y) {
        this._gameOver = true;
      }
    }
    //snake off canvas
    if (this.snake.snakeHeadPos.x > this._canvas.width || this.snake.snakeHeadPos.x < 0 ||
      this.snake.snakeHeadPos.y > this._canvas.height || this.snake.snakeHeadPos.y < 0) {
      this._gameOver = true;
    }
  }

  loop() {
    if (this._gameOver) {
      this.gameOver()
    } else {

      this._context.clearRect(0, 0, canvas.width, canvas.height);
      this._frame ++;
      console.log(this._frame);
      this.drawSnake(this.snake);
      this.drawFood(this.apple);
      this.collide();
            if (this._justEaten){
        this.snake.grow()
      } else {
      this.snake.move()
      }
      this._justEaten = false;
    }



  }

};

  const canvas = document.getElementById('myCanvas');
const pageBody = document.getElementsByTagName("BODY")[0];
  const scoreBoard = document.getElementById('score');
const hiScoreBoard = document.getElementById("hiScore");
  const game = new Game(canvas);
console.log("game starting");

  document.addEventListener("keydown", keyDownHandler, false);
  // document.addEventListener("keyup", keyUpHandler, false);


  function keyDownHandler(e) {
    console.log(e.keyCode)

    if (e.keyCode == 40 && game.snake.dir != "UP") {
      game.snake.dir = 'DOWN'
    } else if (e.keyCode == 37 && game.snake.dir != "RIGHT") {
      game.snake.dir = "LEFT"
    } else if (e.keyCode == 38 && game.snake.dir != "DOWN") {
      game.snake.dir = "UP"
    } else if (e.keyCode == 39 && game.snake.dir != "LEFT") {
      game.snake.dir = "RIGHT"
    } else if (e.keyCode == 32 && game._gameOver) {
      game.reStart();
    }
  }

  var hammertime = new Hammer(pageBody);
  hammertime.on('panleft panright panup pandown press', function(ev) {
    if (ev.type == "pandown" && game.snake.dir != "UP") {
      game.snake.dir = "DOWN";
    } else if (ev.type == "panup" && game.snake.dir != "DOWN") {
      game.snake.dir = "UP";
    } else if (ev.type == "panleft" && game.snake.dir != "RIGHT") {
      game.snake.dir = "LEFT";
    } else if (ev.type == "panright" && game.snake.dir != "LEFT") {
      game.snake.dir = "RIGHT";
    } else if (ev.type = "press" && game._gameOver) {
    game.reStart()}

  });

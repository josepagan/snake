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

  // get fullSnakePos(){
  //     (for elem of this.pos)
  // }




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

    this.snake = new Snake(10, 10);
    this.apple = new Food(Math.floor((Math.random() * this._canvas.width) + 1), Math.floor((Math.random() * this._canvas.height) + 1));
    this.snake.dir = 'RIGHT';



    this._refresh = setInterval(this.loop.bind(this), 1000 / 60 * 10)
    this._frame = 0;






  }

  reset() {}

  gameOver() {
    clearInterval(this._refresh);
    console.log(this._score);

  }

  drawFood(obj) {
    this._context.fillStyle = obj.color;
    this._context.fillRect(obj.pos.x, obj.pos.y, 1, 1);
  }

  drawSnake(obj) {
    this._context.fillStyle = obj.color;
    this.snake.body.forEach(part => this._context.fillRect(part.x, part.y, 1, 1))
  }

  collide() {
    let element;
    if (this.snake.snakeHeadPos.x === this.apple.pos.x && this.snake.snakeHeadPos.y === this.apple.pos.y) {
      console.log("OMG")
      this._score++;
      this.apple = new Food(Math.floor((Math.random() * this._canvas.width) + 1), Math.floor((Math.random() * this._canvas.height) + 1));
      this.snake.grow()
    }

    for (let element of this.snake.snakeRestBodyPos) {
      if (JSON.stringify(element) === JSON.stringify(this.snake.snakeHeadPos)) {
        console.log("Snake touching itself!!!!");
        this._gameOver = true;

      }
    }

    if (this.snake.snakeHeadPos.x > this._canvas.width || this.snake.snakeHeadPos.x < 0 ||
      this.snake.snakeHeadPos.y > this._canvas.height || this.snake.snakeHeadPos.y < 0) {
      console.log('Para alla que se va la bicha!!!');
      this._gameOver = true;
    }


  }






  loop() {
    if (this._gameOver) {
      this.gameOver()
    } else {

      this._context.clearRect(0, 0, canvas.width, canvas.height)
      this.drawSnake(this.snake);
      this.drawFood(this.apple);
      // this._context.font = "5px Arial";
      // this._context.fillText("Hello World",1,1);

      this.collide()
      this.snake.move()
      this._frame++
    }



  }

};

  const canvas = document.getElementById('myCanvas');
  const game = new Game(canvas);

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
    }
  }

  var hammertime = new Hammer(canvas);
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
      location.reload()
    }

  });


var scene = {}, layers = [];
var ball;
function addSceneLayer(name) {
  layers.unshift(name);
  scene[name] = [];
};

// Function fn will recieve object, layer, name
var eachSceneObject = function(fn) {
  _.each(scene, function(layer, name, _scene) {
    _.each(layer, function(obj, i) {
      fn(obj, layer, name);
    });
  });
};

function init() {
  console.log('init')
  addSceneLayer('players')
  addSceneLayer('ball')
  ball = new Ball(new Vector(100, 100));
  var player = new Player(new Vector(200, 200));
  scene.ball.push(ball);
  scene.players.push(player);
}


var render = function() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, conf.width, conf.height)
  eachSceneObject(function(obj, layer, name) {
    if (_.isFunction(obj.render))
      obj.render();
  });
};

var update = function(delta) {
  eachSceneObject(function(obj, layer, name) {
    if (_.isFunction(obj.update))
      obj.update(delta);
  });
};

Ball.prototype = new Circle(conf.ball.radius, new Vector(), conf.ball.color);

Ball.prototype.constructor = Ball;

function Ball(position) {
  this.position = position;
  this.velocity = new Vector(conf.ball.speed, 0);
  this.player = null;
}

Ball.prototype.update = function(delta) {
  if (!this.player) {
    this.position.add(this.velocity.scale(delta, true));
    this.velocity.scale(1-conf.ball.friction);
  }
  else {
    this.velocity = this.player.velocity;
    this.position = this.player.position.clone();
  }
  _.each(scene.players, function(player) {
    if (player.wantsBall && player.collide(ball)) {
      ball.player = player;
      player.gotBall();
    }
  })
}

Ball.prototype.shoot = function() {
  console.log('shoot')
  this.player = null;
}


Player.prototype = new Circle(conf.player.radius, new Vector(), conf.player.color);

Player.prototype.constructor = Player;

function Player(position) {
  this.position = position;
  this.velocity = new Vector(0, 0);
  this.wantsBall = true;
}

Player.prototype.update = function(delta) {
  if ((ball.player !== this) && this.wantsBall) // Has not got the ball
    this.velocity = ball.position.subtract(this.position, true).norm().scale(conf.player.speed);
  this.position.add(this.velocity.scale(delta/17, true));
}

Player.prototype.gotBall = function() {
  this.wantsBall = false;
  console.log('got ball')
  this.velocity = new Vector(1, 1)
  setTimeout(function() {
    ball.shoot()
    this.velocity = new Vector(-1, 0);
  }, 500)
}

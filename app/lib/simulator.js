var ko = require('ko.sync'),
    game = require('models/game'),
    controls = require('models/controls')

exports = module.exports = function() {

  setInterval(_bounce, 1000 / 25)
  //setInterval(_move, 20)
}

function _move() {
  var command = controls.data.command(),
      ball = game.data.ball
  
  if (command === 'up') {
    ball.dx(0)
    ball.dy(-3)
  }
  else if (command === 'down') {
    ball.dx(0)
    ball.dy(3)
  }
  else if (command === 'left') {
    ball.dx(-3)
    ball.dy(0)
  }
  else if (command === 'right') {
    ball.dx(3)
    ball.dy(0)
  }
  
  ball.x((ball.x() + ball.dx()) % 500)
  ball.y((ball.y() + ball.dy()) % 400)
}

function _bounce() {
  var ball = ko.utils.toObject(game.data.ball),
      box = game.data.box
  
  ball.x += ball.dx
  ball.y += ball.dy
  
  if (ball.x > box.width - ball.r) {
    ball.x = box.width - ball.r
    ball.dx = -Math.abs(ball.dx)
  }
  else if (ball.x < ball.r) {
    ball.x = ball.r
    ball.dx = Math.abs(ball.dy)
  }
  
  if (ball.y > box.height - ball.r) {
    ball.y = box.height - ball.r
    ball.dy = -Math.abs(ball.dy)
  }
  else if (ball.y < ball.r) {
    ball.y = ball.r
    ball.dy = Math.abs(ball.dy)
  }
  
  game.data.ball.x(ball.x)
  game.data.ball.y(ball.y)
  game.data.ball.dx(ball.dx)
  game.data.ball.dy(ball.dy)
}
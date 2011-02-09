var game = require('models/game'),
    ko = require('ko.sync')

exports = module.exports = function() {

  setInterval(function() {
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
    
  }, 20)
}
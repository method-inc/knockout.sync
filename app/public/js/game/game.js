// Create objects

var game = new ko.model(),
    controls = new ko.model(),
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    commands = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    },
    ballX = 23;

// The first time we pull game data, start the redraw loop
    
game.on('ready', function() {
  var x = 0;
  (function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //var ball = game.ball.toObject();
    var ball = game.ball;
    ctx.save();
    ctx.translate(ball.x(), ball.y());
    ctx.fillStyle ='#fff';
    ctx.beginPath();
    ctx.arc(0, 0, ball.r(), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save()
    ctx.translate(ballX, 200);
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(0, 0, ball.r(), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    window.setTimeout(update, 20);
  })();
});

window.setInterval(function() {
  ballX += 2;
  ballX %= 400;
}, 20);

// Listen for keyboard input and add to commands

$(document).bind('keydown', function(event) {
  if (commands[event.which]) {
    controls.command(commands[event.which]);
  }
})

ko.utils.socketConnect(null, {
    port: 100,
    transports: ['websocket', 'server-events', 'htmlfile', 'xhr-polling']
  }, '/js/lib/socketio-client/'
);

game.sync(game_id);
controls.sync(controls_id);
var game = require('models/game'),
    controls = require('models/controls')

exports = module.exports = function(server) {

  server.get('/', function(req, res, next) {
    res.render('game', {game_id: game.id, controls_id: controls.id})
  })
  
}
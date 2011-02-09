var game = require('models/game')

exports = module.exports = function(server) {

  server.get('/', function(req, res, next) {
    res.render('game', {game_id: game.id})
  })
  
}
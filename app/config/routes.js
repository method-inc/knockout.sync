var game = require('models/game'),
    controls = require('models/controls'),
    chat = require('models/chat')

exports = module.exports = function(server) {

  server.get('/', function(req, res, next) {
    res.render('game', {game_id: game.id, controls_id: controls.id, chat_id: chat.id})
  })
  
}
function Player(properties) {
  this.graphic = PlayerGraphics[properties.graphic];
}
  
Player.prototype = {

  update: function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  },
  
}

var PlayerGraphics = {
  'bob': 'Some graphic object'
}
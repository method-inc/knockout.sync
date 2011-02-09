function Field(properties) {
  this.platforms = [];
  var i = properties.platforms.length;
  while(--i) {
    this.platforms.push(new Platform(properties.platforms[i]));
  }
}
  
Field.prototype = {
  update: function(properties) {
    for (var key in properties) {
      this[key] = properties[key];
    }
  },
  draw: function() {
    var i = this.platforms.length;
    while(--i) {
      this.platforms[i].draw();
    }
  }
}


function Platform(properties) {
  
}

Platform.prototype = {
  draw: function() {
    // Draw the platform
  }
}
function Network() {
	io.setPath('/js/socketio-client/');
  this._onCreate = function() {};
  this._onUpdate = function() {};
  this._onDestroy = function() {};
}

Network.prototype = {

  onCreate: function(fn) {
    this._onCreate = fn;
  },
  
  onUpdate: function(fn) {
    this._onUpdate = fn;
  },
  
  onDestroy: function(fn) {
    this._onDestroy = fn;
  },

  connect: function() {
    this.socket = new io.Socket(null, {port: 100});
    this.socket.connect();
  	this.socket.on('message', this.receive);
  },
  
  send: function(data) {
    this.socket.send(data);
  },
  
  receive: function(data) {
    var msg = JSON.parse(data);
    if (msg.type === 'update') {
      this._onUpdate(msg.body);
    }
    else if (msg.type === 'create') {
      this._onCreate(msg.body);
    }
    else if (msg.type === 'destroy') {
      this._onDestroy(msg.body);
    }
  }
  
}
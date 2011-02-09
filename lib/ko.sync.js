// Start with: https://github.com/thelinuxlich/knockout.live.plugin/blob/master/knockout.live.plugin.js

var ko = require('knockout'),
    io = require('socket.io')

exports = module.exports = ko


    
var ballX_id = Math.uuidFast(), ballX = 23;

var test_ko_sync_data = {
  name: 'Test Game',
  creators: {
    company: 'Skookum',
    programmers: [ 'Jim', 'Hunter' ]
  },
  ball: {
    x: {_koType: 'observable', id: ballX_id, value: 23},
    y: {_koType: 'observable', id: Math.uuidFast(), value: 100},
    r: {_koType: 'observable', id: Math.uuidFast(), value: 15}
  },
  users: {
    _koType: 'observableArray', id: Math.uuidFast(),
    value: [ 'Jim', 'Hunter' ]
  }
}

// Create the new ko.model type

ko.model = function(object) {
  this.data = object
  this.id = Math.uuidFast()
  _synced.models[this.id] = this
};

// Allow models to simplify themselves for normal JS manipulation

ko.utils.toObject = function(data) {
  return _embed_values(data)
}

// Supply events for models

ko.model.prototype._events = {};
ko.model.prototype.on = function(name, fn){
  if (!(name in this._events)) this._events[name] = [];
  this._events[name].push(fn);
  return this;
};

ko.model.prototype.fire = function(name, args){
  if (name in this._events){
    for (var i in this._events[name])
      this._events[name][i].apply(this, args);
  }
  return this;
};

// Connect KO with Socket.IO

ko.utils.socketListen = function(server, options) {
  var socket = ko.socket = io.listen(server)
  
  socket.on('connection', function(client) {
    console.log("Connection!")
    
    client.on('message', function(data) {
      data = JSON.parse(data);
      console.log("\nmessage:")
      console.dir(data);
      if (data.message === 'get-prop-ids') {
        
        var model = _synced.models[data.model_id]
        var props = _embed_observables(model.data)
        console.log("Embedded observables into properties:")
        console.dir(props)
        
        client.send(JSON.stringify({
          message: 'set-prop-ids',
          model_id: model.id,
          properties: props
        }))
        

        
        /*
        setInterval(function() {
          ballX += 2;
          client.send(JSON.stringify({message: 'update-observable', id: ballX_id, value: ballX}))
          if (ballX > 400) ballX = 0;
        }, 20)
        */
        
      }
    })
    
    client.on('disconnect', function() {
      console.log(client + " disconnected.")
    })
    
  });  
}

ko.utils.socketSend = function(object) {
  ko.socket.send(JSON.stringify(object));
}

// Cache for synced models and observables

var _synced = {
  models: {},         // {resource: 'name', id: 'uuid'}
  observables: {}
}

// Embed values

function _embed_values(object) {
  var type = typeOf(object),
      embedded
  
  if (ko.isObservable(object)) {
    embedded = object()
  }
  else if (type === 'object') {
    embedded = {}
    for (var key in object) {
      embedded[key] = _embed_values(object[key])
    }  
  }
  else if (type === 'array') {
    embedded = []
    for (var i = 0, len = object.length; i < len; i++) {
      embedded.push(_embed_values(object[i]))
    }
  }
  else {
    embedded = object
  }
  return embedded
}


// Embed observables into JSON data representation

function _embed_observables(object) {
  var type = typeOf(object),
      embedded
  
  if (ko.isObservable(object)) {
    embedded = {
      _koType: 'observable',
      value: object()
    }
    if (object._syncId) {
      embedded.id = object._syncId
    }
    else {
    
      // this Observable isn't being synced yet
      
      embedded.id = object._syncId = Math.uuidFast()
      _synced.observables[object._syncId] = object
      object.subscribe(function(newValue) {
        _push_change(object._syncId, newValue)
      }, null, {avoid: ['client']})
    }
  }
  else if (type === 'object') {
    embedded = {}
    for (var key in object) {
      embedded[key] = _embed_observables(object[key])
    }  
  }
  else if (type === 'array') {
    embedded = []
    for (var i = 0, len = object.length; i < len; i++) {
      embedded.push(_embed_observables(object[i]))
    }
  }
  else {
    embedded = object
  }
  return embedded
}

// Push new values of changed observables to the server

function _push_change(observable_id, newValue) {
  var type = typeOf(newValue);
  if (type === 'object') {
    // TODO: Figure out what to do for this
  }
  else if (type === 'array') {
    // TODO: Figure this out
  }
  else {
    ko.socket.broadcast(JSON.stringify({
      message: 'update-observable',
      id: observable_id,
      value: newValue
    }));
  }
}

// Create a new observable

function _create_observable(id, value) {
  //console.log("Creating observable ['" + id + "'], value: " + value)
  var observable = ko.observable(value);
  _synced.observables[id] = observable;
  observable.subscribe(function(newValue) {
    _push_change(id, newValue);
  }, null, {avoid: ['server']});
  return observable;
}

// Extract observables encoded in JSON, create client-side observables for them

function _extract_observables(property) {
  var type = typeOf(property);
  if (type === 'object') {
    if (property._koType) {
      
      // This property is a KO object
      
      if (property._koType === 'observable') {
        var extracted = _create_observable(property.id, _extract_observables(property.value))
      }
    }
    else {
      var extracted = {};
      for (var key in property) {
        extracted[key] = _extract_observables(property[key])
      }
    }
    return extracted;
  }
  else if (type === 'array') {
    var extracted = [];
    for (var i = 0, len = property.length; i < len; i++) {
      extracted.push(_extract_observables(property[i]));
    }
    return extracted;
  }
  else {
    return property;
  }
}

// Douglas Crockford's fixed typeOf()

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}  
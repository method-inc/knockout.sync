// Start with: https://github.com/thelinuxlich/knockout.live.plugin/blob/master/knockout.live.plugin.js

(function KnockoutSync(ko, io) {

  // Create the new ko.model type
  
  ko.model = function() {};
  
  // Request UUIDs for all properties on this model

  ko.model.prototype.sync = function(model_id, mode) {
    _synced[model_id] = this;
    console.log("ko.model['" + model_id + "'] requesting sync of prop-ids...");
    ko.utils.socketSend({message: 'get-prop-ids', model_id: model_id});
  };
  
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
  
  ko.utils.socketConnect = function(address, options, path) {

    if (path) io.setPath(path);
    ko.socket = new io.Socket(address, options);
    
    ko.socket.on('message', function(data) {
      //console.log("received message:")
      data = JSON.parse(data);
      //console.dir(data);
      if (data.message === 'update-observable') {
        
        // Update this observable with values from the server
        
        //_synced.observables[data.id].ignore = true;
        _synced.observables[data.id](data.value, ['server']);   // Definitely OK, must update views
      }
      else if (data.message === 'set-prop-ids') {
        console.log("applying prop ids from server to model['" + data.model_id + "']...");
        
        // Update this model with the server's properties, observables, and IDs
        
        var model = _synced[data.model_id],
            model_props = _extract_observables(data.properties);
        for (var key in model_props) {
          console.log("Creating " + key + " in model")
          model[key] = model_props[key];
        }
        model.fire('ready')
      }
    });
    ko.socket.connect();
  }
  
  ko.utils.socketSend = function(object) {
    ko.socket.send(JSON.stringify(object));
  }
  
  // Cache for synced models and observables

  var _synced = {
    models: {},
    observables: {}
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
      ko.socket.send(JSON.stringify({
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
  
})(ko, io);
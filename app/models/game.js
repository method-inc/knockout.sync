var ko = require('ko.sync')
    
exports = module.exports = new ko.model({
  name: 'Test Game',
  creators: {
    company: 'Skookum',
    programmers: [ 'Jim', 'Hunter' ]
  },
  box: {
    width: 500,
    height: 400
  },
  ball: {
    x: ko.observable(23),
    y: ko.observable(100),
    dx: ko.observable(0),
    dy: ko.observable(0),
    r: ko.observable(15)
  },
  users: ko.observableArray([ 'Jim', 'Hunter' ])
});
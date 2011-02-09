var test_data,
    model_id = Math.uuidFast()
    
exports = module.exports = {

  init: function(ko) {
    test_data = new ko.model({
      name: 'Test Game',
      creators: {
        company: 'Skookum',
        programmers: [ 'Jim', 'Hunter' ]
      },
      ball: {
        x: ko.observable(23),
        y: ko.observable(100),
        r: ko.observable(15)
      },
      users: ko.observableArray([ 'Jim', 'Hunter' ])
    })
  },
  
  id: model_id,
  
  data: test_data

}


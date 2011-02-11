var ko = require('ko.sync')
    
exports = module.exports = new ko.model({
  text: ko.observable('Edit this text')
});
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var User = new Schema ({
  
  username : {
    type: String, 
    required: true, 
    index: {unique: true } 
  },
  userId: {
    type: String, 
    required: true,
    index: {
      unique: true
    }
  },
  timestamp: {
    type: Date, 
    default: Date.now()
  }

})

module.exports = mongoose.model('User', User)
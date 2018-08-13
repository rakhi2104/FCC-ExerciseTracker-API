var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Exercise = new Schema ({
  
  userId : {
    type: String, 
    required: true
  },
  description: {
    type: String, 
    required: true
  },
  duration: {
    type: Number, 
    required: true
  },
  date: {
    type: Date
    // default: Date.now()
  }  
})

// Exercise.pre('save', (next)=> {
//   mongoose.model('User').findOne({userId: this.userId},(err, user) => {
//     if(err) return next(err)
//     if(!user) {
//        return next(new Error("user doesn't exist"))
//     }
//   })
// })


module.exports = mongoose.model('Exercise', Exercise)
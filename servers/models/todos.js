var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true   //adding validation
    },
    completed: {
        type: Boolean,
        default: false  //adding validation
    },
    completedAt: {
        type: Number,
        default: null, // adding validation
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
})
module.exports = { Todo }

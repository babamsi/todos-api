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
    }
})
module.exports = { Todo }
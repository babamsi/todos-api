var mongoose = require('mongoose')
var Users = mongoose.model('Users', {
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true
    }
})

module.exports = { Users }

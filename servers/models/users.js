const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

//use this functionality to make your own methods
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: `{value} is not a valid email`
        }

    },
    password: {
      type: String,
      minlength: 6,
      required: true
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
})
//this code helps you to create your own method
//and this helps me to create a long un understandable worde to be token
//use function instead arrow function because of '''this'''
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })

}

UserSchema.methods.removeToken = function(token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch(e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}
UserSchema.statics.findByCrendentials = function(email, password) {
  var User = this;
  return User.findOne({email: email}).then(user => {
    if(!user) {
      return Promise.reject()
    }
    //bcrypt only supports callback not supports Promise
    //thats why here we create its promise
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, res) => {
       if(res) {
         resolve(user)
       } else {
         reject()
       }
     })
    })

  })
}
UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next()
      })
    })
  } else {
    next();
  }
})

var User = mongoose.model('Users', UserSchema)

module.exports = { User }

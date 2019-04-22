const jwt = require('jsonwebtoken');

var data = {
  id: 4
}

var token = jwt.sign(data, '123456').toString()
console.log(token)
var decoded = jwt.verify(token, '123456')
console.log(decoded);

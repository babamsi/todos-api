const {mongoose} = require('../servers/db/mongoose')
const {Users} = require('../servers/models/users');

const id = '5c5185f0917ae063e1cc2df2'

Users.findById(id).then(user => {
  console.log(user)
}).catch(e => console.log(e))

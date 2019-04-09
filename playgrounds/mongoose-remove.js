const {mongoose} = require('../servers/db/mongoose')
const {Users} = require('../servers/models/users');
const {Todo} = require('../servers/models/todos')

// Todo.remove({}).then(result => {
//   console.log(result)
// })

Todo.findOneAndRemove({_id: "5cac6117c050000d3d174594"}).then(doc => {
  // console.log(doc)
})
// Todo.findByIdAndRemove('5cac60c2c050000d3d17456c').then((doc) => {
//   console.log(doc);
// })

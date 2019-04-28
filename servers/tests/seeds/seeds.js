const {ObjectID} = require('mongodb')
const {Todo} = require('../../models/todos')
const jwt = require('jsonwebtoken')
const {User} = require('../../models/users')

const todos = [{
  _id: new ObjectID(),
  text: "First todo to test"
}, {
  _id: new ObjectID(),
  text: "Second todo to test yyyyeeees",
  completed: false,
  completedAt: null
}]
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'suhayb@asma.com',
  password: 'AsmaaLove',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'Hmmm12@').toString()
  }]
}, {
  _id: userTwoId,
  email: 'user@two.com',
  password: 'user2pass'
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()
    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = {todos, populateTodos, populateUsers, users}

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')


var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { Users } = require('./models/users');

var app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 3000
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    }, (e)=>{
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    res.json(todos)
  }, (e) => {
    res.status(400).json(e)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send()
  }
  Todo.findById(id)
  .then(doc => {
    if(!doc) {
      return res.status(400).send()
    }
    res.send(doc)
  }).catch(e => res.status(400).send())
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  Todo.findByIdAndRemove(id)
    .then(doc => {
      if(!doc) {
        return res.status(404).send()
      }
      res.send(doc)
    }).catch(e => {
      res.status(404).send()
    })
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

module.exports = {app}

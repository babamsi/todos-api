require('./config/config.js');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')
const express = require('express');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todos');
const { Users } = require('./models/users');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT
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
    return res.status(404).send()
  }
  Todo.findById(id)
  .then(doc => {
    if(!doc) {
      return res.status(404).send()
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

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  let body = _.pick(req.body, ['completed', 'text']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  }).catch(e => {
    res.status(400).send()
  })
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

module.exports = {app}

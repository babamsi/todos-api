var express = require('express');
var bodyParser = require('body-parser');


var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todos');
var { Users } = require('./models/users');

var app = express();

app.use(bodyParser.json());


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

app.listen(3000, () => {
    console.log('Server running at port 3000')
})

module.exports = {app}


















// var newTodo = new Todo({
//     text: 'Something To do'
// })

// newTodo.save().then((doc) => {
//     console.log(doc)
// }, (err) => {
//     console.log("Un Able to save the document")
// })

// var otherTodo = new Todo({
//     text: '     suhayb        '
// })

// otherTodo.save().then((doc) => {
//     console.log('saved doc ', JSON.stringify(doc, undefined, 2))
// }, (err) => {
//     console.log('Unable to save the document', err)
// })

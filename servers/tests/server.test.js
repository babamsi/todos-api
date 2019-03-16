const expect = require('expect');
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('../models/todos')

const todos = [{
  _id: new ObjectID(),
  text: "First todo to test"
}, {
  _id: new ObjectID(),
  text: "Second todo to test"
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos)
    }).then(() => done())
})

describe('POST /todo', () => {
    it('Shoud Create a newTodo', (done) => {
        var textToSend = 'This todo text from server test'
        request(app)
            .post('/todos')
            .send({text: textToSend})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(textToSend)
            }).end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({text: textToSend}).then(allTodos => {
                    expect(allTodos.length).toBe(1)
                    expect(allTodos[0].text).toBe(textToSend)
                    done()
                }).catch(e => done(e))
            })
    });

    it('should not create a todo with an invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then(allTodos => {
                    expect(allTodos.length).toBe(2);
                    done()
                }).catch(e => done(e))
            })
    });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect(res => {
      expect(res.body.length).toBe(2)
    })
    .end(done)
  })
});

describe('GET /todos/:id', () => {
  it('Should get Todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(todos[1].text)
    }).end(done)
  });

  it('Should return 400 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(400)
    .end(done)
  });

  it('Should return 400 if id not found or not exists', (done) => {
    request(app)
    .get(`/todos/${123}`)
    .expect(400)
    .end(done)
  })

})

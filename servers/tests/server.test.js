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
  text: "Second todo to test",
  completed: false,
  completedAt: null
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

  it('Should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  });

  it('Should return 404 if id not found or not exists', (done) => {
    request(app)
    .get(`/todos/${123}`)
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toBe(hexId)
    }).end((err, result) => {
      if(err) {
        return done(err)
      }
      Todo.findById(hexId).then(doc => {
        expect(doc).toBeFalsy()
        done()
      }).catch(e => done(e))
    })
  })

  it('Should return 404 if todo is not found', (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  })

  it('Should return 404 if the objectId is not valid', (done) => {
    request(app)
    .delete(`/todos/${123}`)
    .expect(404)
    .end(done)
  })
})


describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    const hexId = todos[1]._id.toHexString();
    const text = 'This from testing';
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
      expect(res.body.completed).toBe(true);
      expect(typeof res.body.completedAt).toBe('number')
    })
    .end(done)
})

  it('Should clear completedAt when the todo is not completed', (done) => {
    const hexId = todos[0]._id.toHexString();
    const text = 'This test from tests'
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text)
      expect(res.body.completed).toBe(false)
      expect(res.body.completedAt).toBeFalsy()
    })
    .end(done)
  })

});

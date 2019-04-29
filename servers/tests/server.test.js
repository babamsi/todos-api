const expect = require('expect');
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('../models/todos')
const{User} = require('../models/users')
const {todos, populateTodos, users, populateUsers} = require('./seeds/seeds')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todo', () => {
    it('Should Create a newTodo', (done) => {
        var textToSend = 'This todo text from server test'
        request(app)
            .post('/todos')
            .send({text: textToSend})
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body.length).toBe(1)
    })
    .end(done)
  })
});

describe('GET /todos/:id', () => {
  it('Should get Todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(todos[1].text)
    }).end(done)
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('Should return 404 if id not found or not exists', (done) => {
    request(app)
    .get(`/todos/${123}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('Should not return todo created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
})
})

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
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

  it('Should not remove a todo created by other user', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end((err, result) => {
      if (err) {
        return done(err)
      }
      Todo.findById(hexId).then(doc => {
        expect(doc).toBeTruthy()
        done()
      }).catch(e => done(e))
    })
  })

  it('Should return 404 if todo is not found', (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('Should return 404 if the objectId is not valid', (done) => {
    request(app)
    .delete(`/todos/${123}`)
    .set('x-auth', users[1].tokens[0].token)
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
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
      expect(res.body.completed).toBe(true);
      expect(typeof res.body.completedAt).toBe('number')
    })
    .end(done)
})

it('Should not update the todo created by other user', (done) => {
  const hexId = todos[1]._id.toHexString();
  const text = 'This from testing';
  request(app)
  .patch(`/todos/${hexId}`)
  .send({
    completed: true,
    text
  })
  .set('x-auth', users[0].tokens[0].token)
  .expect(404)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text)
      expect(res.body.completed).toBe(false)
      expect(res.body.completedAt).toBeFalsy()
    })
    .end(done)
  })

});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done)
  })

  it('Should return 401 if not authenticated', done => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(res => {
      expect(res.body).toEqual({})
    }).end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should return authenticated token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect(res => {
      expect(res.headers['x-auth']).toBeTruthy()
    }).end((err, resp) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then(user => {
        expect(user.tokens[1]).toMatchObject({
          access: 'auth',
          token: resp.headers['x-auth']
        })
        done()
      }).catch(e => done(e))
    })
  })

  it('Should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'Hmmmmmmmm'
    })
    .expect(400)
    .expect(res => {
      expect(res.headers['x-auth']).toBeFalsy()
    }).end((err, resp) => {
      if(err) {
        return done(err)
      }
      User.findById(users[1]._id).then(user => {
        expect(user.tokens.length).toBe(1)
        done()
      }).catch(e => done(e))
    })
  })

})

describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/tokne')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err) {
        return done()
      }
      User.findById(users[0]._id).then(user => {
        expect(user.tokens.length).toBe(0)
        done()
      }).catch(e => done(e))
    })

  })
})

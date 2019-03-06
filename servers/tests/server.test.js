const expect = require('expect');
const request = require('supertest')


const {app} = require('./../server');
const {Todo} = require('../models/todos')

beforeEach((done) => {
    Todo.remove({}).then(() => done())
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

                Todo.find().then(allTodos => {
                    expect(allTodos.length).toBe(1)
                    expect(allTodos[0].text).toBe(textToSend)
                    done()
                }).catch(e => done(e))
            })
    })
    
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
                    expect(allTodos.length).toBe(0);
                    done()
                }).catch(e => done(e))
            })
    })
})
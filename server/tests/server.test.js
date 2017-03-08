const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

beforeEach ((done) => {
  Todo.remove({}).then (() => done());
});

describe('POST /Todo', () => {
  it('should create a new Todo', (done) => {
    var text = 'Test Todo text';

      request(app)
        .post('/Todo')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));

      });
  });
      it('should not crerate todo with invalid body argument', (done) => {


          request(app)
          .post('/Todo')
          .send({})
          .expect(400)
          .end((err, res) => {
          if (err) {
            return done(err);
          }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
});
});

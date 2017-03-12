const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: 3579
}];


beforeEach ((done) => {
  Todo.remove({}).then (() => {
    return Todo.insertMany(todos);
  }).then (() => done());
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
        Todo.find({text}).then((todos) => {
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
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
});
});

describe('GET/todos', () => {
  it('should get all the todos', (done) => {

      request(app)
        .get('/todo')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
  });

});

describe ('Get /todo/:id', () => {
  it('should return todo doc', (done) => {
      request(app)
        .get(`/todo/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
  });

  it('should return a 404 when todo not found', (done) => {

    var hexId = new ObjectID().toHexString();

      request(app)
        .get(`/todo/${hexId}`)
        .expect(404)
        .end(done);


  });

  it('should return a 404 if non-object id', (done) => {

      request(app)
        .get('/todo/123')
        .expect(404)
        .end(done);
  });
});

describe('DELETE/todo/:id', () => {
  it('should remove an item by id', (done) => {
    var hexId = todos[1]._id.toHexString();

      request(app)
        .delete(`/todo/${hexId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done()
        }).catch((err) => done(err));


        });
  });
  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

      request(app)
        .delete(`/todo/${hexId}`)
        .expect(404)
        .end(done);

  });
  it('should return a 404 id objectid is invalid', (done) => {
    request(app)
      .delete('/todo/123abc')
      .expect(404)
      .end(done);

  });

});

describe('PATCH /todo/:id', () => {
  it('should update the todos', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'some new test text';

    request(app)
      .patch(`/todo/${hexId}`)
      .send({
        text : text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('shopild clear completedAt when todo not complete', (done) => {
    var hexId = todos[1]._id.toHexString();

    var text = 'some more new test text';

    request(app)
      .patch(`/todo/${hexId}`)
      .send({
        text : text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

  });
});

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach (populateUsers);
beforeEach (populateTodos);

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
      it('should not create todo with invalid body argument', (done) => {


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

describe('GET /user/me', () => {
  it('should return a user if authenticated', (done) => {
      request(app)
        .get('/user/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
  });



  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /user/me', () => {
  it('should create a user', (done) => {
    var email = 'adrian55@somewhere.com';
    var password = 'password55';

      request(app)
        .post('/User')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        }).end((err) => {
          if (err) {
            return done(err);
          }
          User.findOne({email}).then ((user) => {
              expect(user).toExist();
              expect(user.password).toNotBe(password);
            done();
          });
        });
  });


  it('should return validation error if request invalid', (done) => {
      request(app)
        .post('/User')
        .send({
          email: 'xxx',
          password: 'zykes'
        })
        .expect(400)
        .end(done);
  });

  it('should not create user if email already in use', (done) => {
    var email = 'adrian@somewhere.com';
    var password = 'password1';

    request(app)
      .post('/User')
      .send({email, password})
      .expect(400)
      .end(done);

  });
});

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach (populateUsers);
beforeEach (populateTodos);

describe('POST /todo', () => {
  it('should create a new Todo', (done) => {
    var text = 'Test Todo text';

      request(app)
        .post('/todo')
        .set('x-auth', users[0].tokens[0].token)
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
          .post('/todo')
          .set('x-auth', users[0].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.todos.length).toBe(1);
          })
          .end(done);
    });

  });



  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
  console.log('token :', users[0].tokens[0].token);
    });
  ///
  it('should not return todo doc created by other users', (done) => {
      request(app)
        .get(`/todo/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });

///
  it('should return a 404 when todo not found', (done) => {

    var hexId = new ObjectID().toHexString();

      request(app)
        .get(`/todo/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);


  });

  it('should return a 404 if non-object id', (done) => {

      request(app)
        .get('/todo/123abc')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });
});

describe('DELETE/todo/:id', () => {
  it('should remove an item by id', (done) => {
    var hexId = todos[1]._id.toHexString();

      request(app)
        .delete(`/todo/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
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

  it('should remove an item by id', (done) => {
    var hexId = todos[0]._id.toHexString();

      request(app)
        .delete(`/todo/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done()
        }).catch((err) => done(err));


        });
  });
  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

      request(app)
        .delete(`/todo/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);

  });
  it('should return a 404 id objectid is invalid', (done) => {
    request(app)
      .delete('/todo/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);

  });

});

describe('PATCH /todo/:id', () => {
  it('should update the todos', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'some new test text';
//authenticate as 1st user
    request(app)
      .patch(`/todo/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
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
//duplicate test above
//try to update first todo as second user
//assert 404 response
it('should not update the todo created by other user', (done) => {
  var hexId = todos[0]._id.toHexString();
  var text = 'some new test text';
//authenticate as 1st user
  request(app)
    .patch(`/todo/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text : text,
      completed: true
    })
    .expect(404)
    .end(done);
});

  it('shopild clear completedAt when todo not complete', (done) => {
    var hexId = todos[1]._id.toHexString();

    var text = 'some more new test text';
//authenticate as 2nd user
    request(app)
      .patch(`/todo/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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
          }).catch((e) => done(e));
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
    var email = 'lucy@somewhere.com';
    var password = 'password1';

    request(app)
      .post('/User')
      .send({email: users[0].email,
         password: 'password1'})
      .expect(400)
      .end(done);

  });
});

describe('POST /user/login', () => {
  it('should login user and return a token', (done) => {
    request(app)
      .post('/user/login')
      .send({
        email: users[1].email,
        password: users[1].password

      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then ((user) => {
          expect(user.tokens[1]).toInclude ({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });
  it('should reject invalid login ', (done) => {
    request(app)
      .post('/user/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then ((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });

  });
});

describe('DELETE /user/me/token', () => {
  it('should remove auth token on logout', (done) =>{

      request(app)
        .delete('/user/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

        User.findById(users[0]._id).then ((user) => {
          expect(user.tokens.length === 0);
          done();
        }).catch((e) => done(e));
      });
  });
});

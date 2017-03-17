const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todos');
const {User} = require('./../../models/users');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'adrian@somewhere.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoID,
  email: 'ade1@somewhere.com',
  password: 'password2'

}]


const todos = [{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: 3579
}];

const populateTodos = (done) => {
  Todo.remove({}).then (() => {
    return Todo.insertMany(todos);
  }).then (() => done());
};

const populateUsers = (done) => {
  User.remove({}).then (() => {

  var userOne = new User(users[0]).save();
  var userTwo = new User(users[1]).save();

  return Promise.all([userOne, userTwo])
}).then (() => done());

};

module.exports = {todos, populateTodos, users, populateUsers};

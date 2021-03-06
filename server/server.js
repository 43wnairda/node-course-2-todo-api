require('./config/config');

const {ObjectID} = require('mongodb');    //temp here for exercise
const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');
const bcrypt = require('bcryptjs');

var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

////POST/////
app.post('/todo', authenticate, (req, res) =>{
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then ((doc) => {
      res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

/////GET/////
app.get('/todo', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
});
});

//Get params
app.get('/todo/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  console.log('_id: ', id);
  console.log('_creator: ', req.user._id);
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then ((todo) => {

    if (!todo) {
        return res.status(404).send()
      }

      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

///////////////////////////////Delete////
app.delete('/todo/:id', authenticate, (req, res) => {

var id = req.params.id;
if (!ObjectID.isValid(id)) {
  return res.status(404).send();
}

Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
}).then ((todo) => {
  if (!todo) {
      res.status(404).send()
      }
    res.send({todo});
  }).catch((e) => {
  res.status(400).send();
});
});
////////////////////////////////PATCH////

app.patch('/todo/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])    //text and completed are the only properties ther usewr can update, if they exist

  if (!ObjectID.isValid(id)) {                  //temp here for the exercise
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed)  && body.completed) {   //if completed is a booleam & is = 'true'
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  //findOneAndUpdate _id, _creator
  Todo.findOneAndUpdate({_id:id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {

    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })

});
///////////////////////////////
app.post('/user', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User (body);


  user.save().then (() => {
    return user.generateAuthToken();

      }).then ((token) => {
    //res.header('x-auth', token).send({user});...this is a user collection
    res.header('x-auth', token).send(user); //this is a single user
  }).catch ((e) => {
    res.status(400).send(e);
  })
});


//get user by token

app.get('/user/me', authenticate, (req, res) => {

    res.send(req.user);
});
///////////////////////////////////////////////

////POST /user/login {email, password}     for logins from additional devices or where token lost.
//use res.send(res,body) and also test in postman

 app.post('/user/login', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password'])

User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
    res.header('x-auth', token).send(user);
  })

}).catch((e) => {
  res.status(400).send();
});

});

////logging someone out/deleting their token
app.delete('/user/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () =>{
  console.log(`Listening on port: ${port}`);
});

module.exports = {app};   //ES6 syntax for app = app

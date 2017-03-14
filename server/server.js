require('./config/config');

const {ObjectID} = require('mongodb');    //temp here for exercise
const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todos');
const {User} = require('./models/users');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

////POST/////
app.post('/todo', (req, res) =>{
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then ((doc) => {
      res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

/////GET/////
app.get('/todo', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
});
});

//Get params
app.get('/todo/:id', (req, res) => {      //:id is the name i have given this param but could be anything

  var id = req.params.id;
  console.log(id);


  if (!ObjectID.isValid(id)) {                  //temp here for the exercise
    return res.status(404).send();
  }

  Todo.findById(id).then ((todo) => {           //temp here for the exercise
    if (!todo) {
        res.status(404).send()
        }
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

///////////////////////////////Delete////
app.delete('/todo/:id', (req, res) => {

var id = req.params.id;
if (!ObjectID.isValid(id)) {                  //temp here for the exercise
  return res.status(404).send();
}

Todo.findByIdAndRemove(id).then ((todo) => {
  if (!todo) {
      res.status(404).send()
      }
    res.send({todo});
  }).catch((e) => {
  res.status(400).send();
});
});
////////////////////////////////PATCH////

app.patch('/todo/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

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
    res.header('x-auth', token).send({user});

  }).catch ((e) => {
    res.status(400).send(e);
  })
});




////////////////////////////////////////////////
app.listen(port, () =>{
  console.log(`Listening on port: ${port}`);
});

module.exports = {app};   //ES6 syntax for app = app

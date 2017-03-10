const {ObjectID} = require('mongodb');    //temp here for exercise


var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');

var app = express();

app.use(bodyParser.json());

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

app.listen(3000, () =>{
  console.log('Listening on port 3000');
});

module.exports = {app};   //ES6 syntax for app = app

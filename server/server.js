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


app.listen(3000, () =>{
  console.log('Listening on port 3000');
});

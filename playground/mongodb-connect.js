// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');               //in ES6 this is identical to the call above (object destructuring
                                                                  // ObjectID is an addition
// var user = {name: 'Adrian, age: 52'};        //these 3 lines are a good way to understand object destructuring
// var {name} = user
// console.log(name);

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');      //return used so we never see the below success message if there is an error
  }
  console.log('Connected to mongodb server');

  //  db.collection('Todos').insertOne ({
  //     text: 'another entry',
  //     completed: false
  //   }, (err, result) => {
  //    if (err) {
  //      return console.log('unable to insert document', err);
  //   }
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //  });


  db.collection('Users').insertOne({
      name: 'Sarah',
      age: 55,
      location: 'Chichester'
    }, (err, result) => {
        if (err) {
          return console.log('unable to insert document', err);
        }
          console.log(result.ops[0]._id.getTimestamp());
    });

  db.close();

});

// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');      //return used so we never see the below success message if there is an error
  }
  console.log('Connected to mongodb server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58bd63e7a503ab16bb17c166')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log (result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58bd7ae8c1584606899eaf1b')
  }, {
    $set: {
      name: 'Sarah'
    },
      $inc: {
        age: 2
      }  
    }, {
    returnOriginal: false
  }).then((result) => {
    console.log (result);
  });


  db.close();

});

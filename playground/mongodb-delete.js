// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');      //return used so we never see the below success message if there is an error
  }
  console.log('Connected to mongodb server');

    //Delete Many
    // db.collection('Todos').deleteMany({text: 'Eat samich 1'}).then((result) => {
    //   console.log (result);
    // });

    //Delete one
    // db.collection('Todos').deleteOne({text: 'Eat samich 1'}).then((result) => {
    //   console.log (result);
    // });


    //Find One and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //   console.log (result);
    // });


    //Delete Many
    // db.collection('Users').deleteMany({name: 'Lucy'}).then((result) => {
    //   console.log (result);
    // });

    //Find One and delete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('58bc6961005de80314b5fbca')}).then((result) => {
      console.log (JSON.stringify(result, undefined, 2));
    });



  db.close();

});

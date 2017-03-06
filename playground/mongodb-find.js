// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongodb server');      //return used so we never see the below success message if there is an error
  }
  console.log('Connected to mongodb server');

    //db.collection('Todos').find({completed: false}).toArray().then ((docs) => {  //one example fetches documents from the array collection
                                                                                  // where the value of completed = false
    // db.collection('Todos').find({
    //   _id: new ObjectID('58bbed17ef4cc002ff5a06d8')
    // }).toArray().then ((docs) => {
    //
    //     console.log('Todos: ');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('unable to fetch Todos', err);
    // });

    // db.collection('Todos').find().count().then ((Count) => {
    //
    //     console.log(`Todos count: ${Count}`);
    //
    // }, (err) => {
    //     console.log('unable to fetch Todos', err);
    // });

    db.collection('Users').find({name:'Lucy'}).toArray().then ((docs) => {
        console.log('Users: ');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch Users', err);
    });


  db.close();

});

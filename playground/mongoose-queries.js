const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

var id = '58beb17b362b8409e967744a';

// var id = '58c00be3840d8e0660de520c11';
//
// if (!ObjectID.isValid(id)) {
//   console.log('id is not valid');
// }

// Todo.find({
//   _id: id
// }).then ((todos) => {
//     console.log('todos', todos);
// });
//
// Todo.findOne({          //this is a better method than .find above as it doesn't rely on an array
//   _id: id
// }).then ((todo) => {
//     console.log('todo', todo);
// });

// Todo.findById(id).then ((todo) => {
//   if (!todo) {
//     return console.log('id not found');         //return statement stops execution of any further code
//   }
//     console.log('todo by id', todo);
// }).catch((e) => console.log(e));

User.findById('58beb17b362b8409e967744a').then ((user) => {
    if (!user) {
      return console.log('id not found');
    }
      console.log(JSON.stringify(user, undefined, 2));
// }, (e) => {
//   console.log(e);
}).catch((e) => console.log(e));          //i used a catch here as we rem'd out the ObjectId.isValid above.

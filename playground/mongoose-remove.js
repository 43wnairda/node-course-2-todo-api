const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');


//Rmoves all
// Todo.remove({}).then((results) => {
//   console.log (results);
// })

//Does what it says on the tin
Todo.findOneAndRemove({_id: '58c3e0f8b5fcf82fa7a6cba9'}).then ((todo) => {


});

//Does as it says on the tin
Todo.findByIdAndRemove('58c3e0f8b5fcf82fa7a6cba9').then((todo) => {
  console.log(todo);
})

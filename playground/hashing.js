
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//var password = '123abc!';

//slating and hashing passwords////
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });
// ///////
//comparing hashing value with value user entered to allow access to app or not.
var hashedPassword = '$2a$10$DxEAl5Xf7Fi/dWnMZQ62Ru1/DBGuCcIjw1ZrGsEaJt2tRTYU.qC.6';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
/////////




// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');           //last value is the salt
//  console.log(token);
//
//  var decoded = jwt.verify(token, '123abc');
//  console.log('decodedc :', decoded);

 ///this playground uses the commented out code below just as an example.  in real life will use JWT to handle all this..see rem'd out code above

// var data = {
//   id: 5
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()  //adding secret value like this is called Salting
// };
//
// ///man in the middle attack
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// ////
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed, do not trust');
// }

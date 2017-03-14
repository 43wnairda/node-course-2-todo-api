///this playground uses the commented out code belowjust an example.  in real life will use JWT to handle all this

const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, '123abc');           //last value is the salt
 console.log(token);

 var decoded = jwt.verify(token, '123abc');
 console.log('decodedc :', decoded);

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

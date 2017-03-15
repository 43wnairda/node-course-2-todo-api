const mongoose = require ('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    maxlength: 26,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    message: '{VALUE} is not a valid email'
  }
},
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
    }]
});

UserSchema.methods.toJSON = function () {   //this allows us to override the json being sent back and return only what we want them to see
                                            //the UserSchema method below reurns all incl' token, which is why this method
var user = this;                            // is being used to ensure the token etc is not returmned to the user.
var userObject = user.toObject();

return _.pick(userObject, ['_id', 'email']);

};

UserSchema.methods.generateAuthToken = function () {    //arrow functions do not bind a this keyword, need a good old fashioned function for that
  var user = this;          //need a this keyword for the methods, as it stores the individual document.
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();  //note access is ES6 for access: access

  user.tokens.push({access, token});

  return user.save().then (() => {
    return token;                   //here we are returning a value rather than the usual Promise
  })
};

UserSchema.statics.findByToken = function (token) {       //statics is similar to .methods but returns model methods instead of incidents methods.
  var User = this;                              //model methods get called with the Model User.  Incidents get called with the doc user
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // return new  ((resolve, reject) => {
    //   reject();
    // });

    //can achieve the same as above with
    return Promise.reject();
    ///////////
    
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};

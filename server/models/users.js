const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
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


UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update ({
      $pull: {
          tokens: {token}
      }
    });
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
//////////

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise ((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            resolve(user);
        } else {
          reject();
        }


     });
    });

  });


};

///////////////////hashing passwords before saving the user to the database///
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
////////////////////////////////

var User = mongoose.model('User', UserSchema);

module.exports = {User};


var {User} = require('./../models/users');

var authenticate = (req, res, next) => {          //this is the function we will use in middlewear to make all of our routes private.
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {           //this model method defined in users.js
    if (!user) {
      return Promise.reject();
    }


    req.user = user;
    req.token = token;
    next();
    }).catch  ((e) => {
      res.status(401).send();
    });
};

module.exports = {authenticate};

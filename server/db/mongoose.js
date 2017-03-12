var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI); //process.env.MONGODB_URI checks for the existence
                                                                                  //of the url that heroku has given us for or mongodb instance

module.exports = {mongoose};

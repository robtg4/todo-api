//return db connection to server.js
var Sequelize = require('sequelize');
//instance of Sequelize that you can do stuff with
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/dev-todo-api.sqlite'
});

//create new object
var db = {};

//load in all sql models
db.todo = sequelize.import(__dirname + "/models/todo.js");
db.sequelize = sequelize; //instance
db.Sequelize = Sequelize; //library

//export to any file that needs it
module.exports = db;

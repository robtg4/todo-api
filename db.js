//return db connection to server.js
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || "development";
var sequelize;

if (env == "production")
{
  //instance of Sequelize that you can do stuff with
  //when in production (heroku)
  sequelize = new Sequelize(process.env.DATABASE_URL,{
    'dialect': 'postgres',
  });
} else
{
  //instance of Sequelize that you can do stuff with
  //when not in production
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
  });
}


//create new object
var db = {};

//load in all sql models
db.todo = sequelize.import(__dirname + "/models/todo.js");
db.user = sequelize.import(__dirname + "/models/user.js");
db.token = sequelize.import(__dirname + "/models/token.js");
db.sequelize = sequelize; //instance
db.Sequelize = Sequelize; //library

//assoicating models with each other
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

//export to any file that needs it
module.exports = db;

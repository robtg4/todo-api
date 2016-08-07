var Sequelize = require('sequelize');
//instance of Sequelize that you can do stuff with
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname+'/basic-sqlite-database.sqlite'
});

//defining a model (a table)
//modle name, attributes config
//allowNull - allows null value
//find more at docs.sequelizejs.com
var Todo = sequelize.define("todo", {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

//new model with type
var User = sequelize.define('user', {
  email: Sequelize.STRING
});
//mapping todos to Users, sets relationship
Todo.belongsTo(User);
User.hasMany(Todo);

//synching
sequelize.sync({
  //force: true
}).then(function(){
  console.log("Everything is synched");

  //challenge - return todos of user 1 that are true
  User.findById(1).then(function(user) {
    user.getTodos({
      where: {
        completed: false
      }
    }).then(function(todos) {
      todos.forEach(function(todo) {
        console.log(todo.toJSON());
      });
    });
  });



});

//Belongs in sync function

//creating data (relational data)
/*
//set data in database
User.create({
  email: 'rogreen@umich.edu'
}).then(function(user) {
  return Todo.create({
    description: 'clean the yard',
    completed: false
  });
}, function(e) {

}).then(function(todo) {
  User.findById(1).then(function(user) {
    user.addTodo(todo);
  });
}, function(e) {
  console.log(e);
});
*/
//challenge
/*
Todo.findById(1).then(function(todo) {
  if (todo)
  {
    console.log(todo.toJSON());
  } else
  {
    console.log("Todo not found!")
  }
}).catch(function(e) {
  console.log(e.message);
});
*/


//create a new todo item (row)
/* Todo.create({
  description: 'Walk my dog all the way',
  completed: false
}).then(function(todo) {
  return Todo.create({
    description: "Go through the bowels of hell"
  });
}).then(function(){
  //return Todo.findById(1) //find by id
  return Todo.findAll({ //find by criteria
    where: {
      //add another completed for querying
      description: {
        $like: '%HELL%'
      }
    }
  });
}).then(function(todos) {
  if (todos)
  {
    todos.forEach(function(todo) {
      console.log(todo.toJSON());
    });
  } else
  {
    console.log("No todos found!");
  }
}).catch(function(e) {
  console.log("ERROR: " + e.message);
});*/

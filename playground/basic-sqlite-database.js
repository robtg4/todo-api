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

//synching
sequelize.sync({
  //force: true
}).then(function(){
  console.log("Everything is synched");

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

});

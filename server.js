//setting up server app and port
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //underscorejs.org
var db = require('./db.js'); //access to db

//variables and data
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

//middleware
app.use(bodyParser.json());

//REQUESTS
app.get('/', function(req, res) {
  res.send("Todo API Root");
});
//GET all todos, /todos?completed=true
app.get('/todos', function(req, res) {
  //use .json to stringigy array into json
  var query = req.query;
  var where = {}
  //if has property && completed === 'true/false'
  if (query.hasOwnProperty('completed') && query.completed == 'true')
  {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed == 'false')
  {
    where.completed = false;
  }
  //?q="" query set to string
  if (query.hasOwnProperty('q') && query.q.length > 0)
  {
    where.description = {
      $like: "%"+query.q+"%"
    };
  }
  //make request to find all
  db.todo.findAll({
    where: where
  }).then(function(todos) {
    return res.json(todos);
  }).catch(function(e) {
    return res.status(500).send(e.message);
  });

});
//GET individual todo, use :id for var names
app.get('/todos/:id', function(req, res) {
  //use req.params.var_name to get passed variable value
  var todoId = parseInt(req.params.id, 10);
  db.todo.findById(todoId).then(function(todo) {
    if (!!todo)
    {
      res.json(todo.toJSON());
    } else
    {
      res.status(404).send("Todo not found!");
    }
  }).catch(function(e) {
    res.status(400).send(e.message);
  });
});
//POST a todo to app (can take data)
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  //create db item and validate with promise chain
  db.todo.create({
    description: body.description.trim(),
    completed: body.completed
  }).then(function(todo) {
    res.json(todo.toJSON());
  }).catch(function(e) {
    res.status(400).json(e);
  });
});
//DELETE a todo item
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo)
  {
    todos = _.without(todos, matchedTodo);
    res.send("TODO task with id "+matchedTodo.id+" deleted!");
  } else
  {
    res.status(404).json({"error": "no todo found with that id"});
  }
});
//UPDATE (PUT) a todo item
app.put('/todos/:id', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  //matchedTodo not there
  if (!matchedTodo)
  {
    return res.status(404).send();
  }

  //validate body completed
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))
  {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed'))
  {
    //bad because it's not a boolean
    return res.status(400).send();
  } else
  {
    //never provided attribute, no problem here
  }

  //validate body description
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0)
  {
    validAttributes.description = body.description.trim();
  } else if (body.hasOwnProperty('description'))
  {
    //bad because it's not a boolean
    return res.status(400).send();
  }

  //we know we have valid, so we can update
  matchedTodo = _.extend(matchedTodo, validAttributes);
  return res.json(matchedTodo);

});

//synch to db
db.sequelize.sync({
  force: false
}).then(function() {
  //listening server
  app.listen(PORT, function() {
    console.log("Express Listening on PORT " + PORT +"!");
  });
})




/* SET UP
mkdir directory_name
cd directory_name
[create .gitignore file in project and ignore node_modules/]
git init
npm init
npm install express@4.13.3 —save
write code
heroku create
heroku rename "new name"
git status
git add .
git status
git commit -m "Message"
git push heroku master
heroku open

go to github, login, create new repo public no read me
and then copy and paste push related lines into terminal
*/

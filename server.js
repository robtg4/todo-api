//setting up server app and port
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //underscorejs.org

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
  var queryParams = req.query;
  var filteredTodos = todos;

  //if has property && completed === 'true/false'
  if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'true')
  {
    filteredTodos = _.where(filteredTodos, { completed: true});
    return res.json(filteredTodos);
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'false')
  {
    filteredTodos = _.where(filteredTodos, { completed: false});
    return res.json(filteredTodos);
  }

  //?q="" query set to string
  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0)
  {
    filteredTodos = _.filter(filteredTodos, function(todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    });
  }

  res.json(filteredTodos);
});
//GET individual todo, use :id for var names
app.get('/todos/:id', function(req, res) {
  //use req.params.var_name to get passed variable value
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (typeof(matchedTodo) != "undefined")
  {
    res.json(matchedTodo);
  } else
  {
    res.status(404).send();
  }
});
//POST a todo to app (can take data)
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  //validate by checking object properties
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0)
  {
    res.status(400).send();
  } else
  {
    body.description = body.description.trim();
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
  }
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

//listening server
app.listen(PORT, function() {
  console.log("Express Listening on PORT " + PORT +"!");
});


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

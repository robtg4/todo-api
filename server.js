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
//GET all todos
app.get('/todos', function(req, res) {
  //use .json to stringigy array into json
  res.json(todos);
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
  var body = req.body;

  //validate by checking object properties
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0)
  {
    res.status(400).send();
  } else
  {
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
  }
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

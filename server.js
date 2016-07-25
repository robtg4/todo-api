//setting up server app and port
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//variables
var todos = [{
  id: 1,
  description: 'Meet mom for Lunch',
  completed: false,
}, {
  id: 2,
  description: 'Go to market',
  completed: false,
}, {
  id: 3,
  description: 'Study programming',
  completed: true,
}];

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
  for (var i = 0; i < todos.length; i++)
  {
    if (todos[i].id == todoId)
    {
      res.json(todos[i]);
    }
  }
  //how to send a 404 if get invalid
  res.status(404).send();
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
*/

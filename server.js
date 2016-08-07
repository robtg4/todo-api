//setting up server app and port
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); //underscorejs.org
var db = require('./db.js'); //access to db
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db); //mw object

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
app.get('/todos', middleware.requireAuthentication, function(req, res) {
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
app.get('/todos/:id',middleware.requireAuthentication, function(req, res) {
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
app.post('/todos',middleware.requireAuthentication, function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  //create db item and validate with promise chain
  db.todo.create(body).then(function(todo) {
    //creates association
    req.user.addTodo(todo).then(function() {
      //todo here diff than before, reload
      return todo.reload();
    }).then(function(todo) {
      res.json(todo.toJSON());
    });
  }).catch(function(e) {
    res.status(400).json(e);
  });
});
//DELETE a todo item
app.delete('/todos/:id',middleware.requireAuthentication, function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted  === 0)
    {
      res.status(404).json({
        error: "No todo with id"
      });
    } else
    {
      res.status(204).send()
    }
  }, function() {
    res.status(500).send();
  });

});
//UPDATE (PUT) a todo item
app.put('/todos/:id',middleware.requireAuthentication, function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};
  var todoId = parseInt(req.params.id, 10);


  //validate body completed
  if (body.hasOwnProperty('completed'))
  {
    attributes.completed = body.completed;
  }

  //validate body description
  if (body.hasOwnProperty('description'))
  {
    attributes.description = body.description.trim();
  }

  db.todo.findById(todoId).then(function(todo) {
    if (todo)
    {
      todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
      }, function(e){
        res.status(400).json(e);
      });
    } else
    {
      return res.status(404).send();
    }
  }, function() {
    return res.status(500).send();
  });

});
//user based POST request (sign up)
app.post('/users', function(req, res) {
  var body = _.pick(req.body, 'email', 'password');
  //create db item and validate with promise chain
  db.user.create({
    email: body.email.trim(),
    password: body.password
  }).then(function(user) {
    res.json(user.toPublicJSON());
  }).catch(function(e) {
    res.status(400).json(e);
  });
});
//POST METHOD login
app.post('/users/login', function(req, res) {
  var body = _.pick(req.body, 'email', 'password');

  db.user.authenticate(body).then(function(user) {
    var token = user.generateToken('authentication');

    if (token)
    {
      res.header('Auth', token).json(user.toPublicJSON());
    } else
    {
      res.status(401).send();
    }

  }, function(e) {
    res.status(401).send();
  });

});

//synch to db
db.sequelize.sync({
  force: true
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

When you need to make the server and database live on heroku
you can add a live db postgres by doing the following:
heroku addons:create heroku-postgresql:hobby-dev (the type of plan)
heroku pg_wait
heroku pg_wait - waiting for the operation to be done
npm install pg@4.4.1 --save
npm install pg-hstore@2.3.2 --saves
made sequelize var changes based on production type
in db.js (environment variable)
*/

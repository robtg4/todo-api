//setting up server app and port
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//get request
app.get('/', function(req, res) {
  res.send("Todo API Root");
});

//listening server 
app.listen(PORT, function() {
  console.log("Express Listening on PORT " + PORT +"!");
});

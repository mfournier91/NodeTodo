//setup
var express = require('express');
var app = express();  //create the app with express
var mongoose = require('mongoose'); //mongodb object model mapper
var morgan = require('morgan'); //log requests to the console
var bodyParser = require('body-parser');  //pull info from an html post
var methodOverride = require('method-override'); //simulate Delete and put

//config
mongoose.connect('mongodb://localhost/nodetodo'); //connect to our db

app.use(express.static(__dirname + '/public')); //set the static files location
app.use(morgan('dev'));
app.use(bodyParser.json()); //body parser is middleware that parses out json from the http request body
app.use(bodyParser.urlencoded({'extended' : 'true'})); //let body parser handle url encoded data such as %20 etc
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

var Todo = mongoose.model('Todo', {
  text : String
});

//api
//get all todos
app.get('/api/todos', function(req, res){

  //use mongoose to get all todos in the database
  Todo.find(function(err, todos){
    if (err){
      res.send(err);
    }
    res.json(todos); //return todos in json format
  });
});

//create todo and send back all todos after creation
app.post('/api/todos', function(req, res){

  //create a todo, info comes from AJAX request from angular
  Todo.create({
    text : req.body.text,
    done : false
  }, function(err, todo){
    if (err){ res.send(err);}

    //get and return all todos after creation
    Todo.find(function(err, todos){
      if (err){ res.send(err);}
      res.json(todos);
    });

  });
});

//delete todo
app.delete('/api/todos/:todo_id', function(req, res){
  Todo.remove({
    _id : req.params.todo_id
  }, function(err, todo){
    if (err){ res.send(err)};

    //get and return all todos after deletion
    Todo.find(function(err, todos){
      if (err){ res.send(err)};
      res.json(todos);
    });

  });
});

//hey, listen
app.listen(8080);
console.log("App listening on port 8080");

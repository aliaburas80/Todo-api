var express = require('express');
var bodyParser = require('body-parser');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId=1;

app.use(bodyParser.json());

app.get('/', function(req,res){
  res.send('todo API ROOT');
});

app.get('/todos',function(req,res){
  res.json(todos);
});

app.get('/todos/:id',function(req,res){
  var todoID = req.params.id;
  todos.forEach(function(todo){
    if(todo.id == todoID){
      res.json(todo);
      return;
    }
  });
  res.set('Content-Type', 'text/plain');
  res.status(404).send(todoID+', there is no such ID in our database!');
});


app.post('/todos',function(req,res){
  var body = req.body;
  console.log('description: '+body.description);
  body.id = todoNextId++;
  todos.push(body)
  res.json(todos);
});

app.listen(PORT,function(){
  console.log('Express listening on port '+PORT+'!');
});

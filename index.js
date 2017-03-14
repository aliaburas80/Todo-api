var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id:1,
    description: 'Jana and Joud',
    completed:false
  },
  {
    id:2,
    description:'macbook',
    completed:false
  },
  {
    id:3,
    description:'mbc',
    completed:true

  }];

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

  res.send(todoID+', there is no such ID in our database!');
});

app.listen(PORT,function(){
  console.log('Express listening on port '+PORT+'!');
});

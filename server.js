var express = require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
/**
Using underscore to refactore git and post
*/
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
  var todoID = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos,{id: todoID});
  if(matchedTodo){
      res.json(matchedTodo);
      return;
    }
    res.set('Content-Type', 'text/plain');
    res.status(404).send(todoID+', there is no such ID in our database!');
    // todos.forEach(function(todo){
    //   if(todo.id == todoID){
    //     res.json(todo);
    //     return;
    //   }
    // });
    // res.set('Content-Type', 'text/plain');
    // res.status(404).send(todoID+', there is no such ID in our database!');

  });

app.post('/todos',function(req,res){
  var body = req.body;
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    return res.status(400).send('Data passed not formated well');
  }

  body.description = body.description.trim();
  body.id = todoNextId++;
  todos.push(_.pick(body,'id','description','completed'));
  res.json(todos);
});

app.delete('/todos/:id',function(req,res){
  var todoID = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos,{id: todoID});
  if(!matchedTodo){
    res.status(200).json({"error":'Item is deleted'});
  }else{
    todos = _.without(todos,matchedTodo);
    res.json(matchedTodo);
  }
  // var counter=0;
  // todos.forEach(function(item){
  //   if(item.id == todoID){
  //     console.log('todoID: '+todoID+'    item.id: '+item.id);
  //     todos.splice(counter,1);
  //     res.status(200).json({"error":'Item is deleted'});
  //     return;
  //   }
  //   counter++;
  // });
  //
  // res.status(400).json({"error":'Item is undefinde'});

/*  var matchedTodo = _.findWhere(todos,{id: todoID});
  if(matchedTodo){
      res.delete(matchedTodo);
      return;
    }*/
});

app.listen(PORT,function(){
  console.log('Express listening on port '+PORT+'!');
});

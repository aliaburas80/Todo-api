var express = require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var db = require('./db.js');
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
  var query = req.query;
  var where = {};

  if(query.hasOwnProperty('completed') &&
     query.completed === 'true'){
       where.completed = true;
     }else if(query.hasOwnProperty('completed') &&
        query.completed === 'false'){
        where.completed = false;
     }


   if(query.hasOwnProperty('q') &&
      query.q.length > 0){
        where.description = {
          $like:'%'+query.q+'%'
        }
      }

      db.todo.findAll({where:where}).then(function(item){
        res.status(200).json(item)
      },function(e){
        res.status(500).json(e);
      }).catch(function(e){
        console.error(e);
          res.status(404).json(e);
      })




  // var filteredTodos = todos;
  //
  // if(queryParams.hasOwnProperty('completed') &&
  //    queryParams.completed === 'true'){
  //
  //   filteredTodos = _.where(filteredTodos,{completed:true});
  // } else if(queryParams.hasOwnProperty('completed') &&
  //           queryParams.completed === 'false'){
  //
  //   filteredTodos =_.where(filteredTodos, {completed : false});
  // }
  // /**/
  // if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
  //   console.log(queryParams.q);
  //   filteredTodos=_.filter(filteredTodos,function(todo){
  //     console.log(todo.description.indexOf(queryParams.q));
  //       return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
  //   });
  // }
  //
  // res.json(filteredTodos);

});




app.get('/todos/:id',function(req,res){

  var todoID = parseInt(req.params.id);
  console.log(todoID);
  db.todo.findById(todoID).then( function(item){// success
      if(!!item){
        res.status(200).json(item.toJSON());
      }else{
        res.status(404).send('todo id its not included in our database');
      }
    }, function(error){
        res.status(500).json(error)
    }
  ).catch(function(e){
    res.status(500).json(e);
  });


  // var todoID = parseInt(req.params.id);
  // var matchedTodo = _.findWhere(todos,{id: todoID});
  // if(matchedTodo){
  //     res.json(matchedTodo);
  //     return;
  //   }
  //   res.set('Content-Type', 'text/plain');
  //   res.status(404).send(todoID+', there is no such ID in our database!');



    // todos.forEach(function(todo){
    //   if(todo.id == todoID){modles
    //     res.json(todo);
    //     return;
    //   }
    // });
    // res.set('Content-Type', 'text/plain');
    // res.status(404).send(todoID+', there is no such ID in our database!');

  });




app.post('/todos',function(req,res){
  var body = _.pick(req.body,'description','completed');

  console.log(body);

  if(!_.isBoolean(body.completed)  ||
     !_.isString(body.description) ||
     body.description.trim().length === 0){
    return res.status(400).send('Data passed not formated well');
  }

  db.todo.create({
    description:body.description.trim(),
    completed : body.completed
  }).then(function(item){

    res.status(200).send('Data saved! \ndescription:'+item.toJSON().description + '\n completed:'+item.toJSON().completed);

  }).catch(function(error){
    console.error(error);
    res.status(400).send(error);
  });


  // var body = req.body;
  // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
  //   return res.status(400).send('Data passed not formated well');
  // }
  //
  // body.description = body.description.trim();
  // body.id = todoNextId++;
  // todos.push(_.pick(body,'id','description','completed'));
  // res.json(todos);
  //
  //


});







app.delete('/todos/:id',function(req,res){
  var todoID = parseInt(req.params.id);
  db.todo.destroy({
    where:{
      id:todoID
    }
  }).then(
    function(success){
      if(success === 0){
        res.status(404).json( {error:"there is no data to deleted!"});
      }else{
        res.status(200).send('Success delete item #'+success+' items');
      }
    },function(failed){
      res.status(404).json(failed);
    }
  ).catch(function(error){
    res.status(500).json(error);
  });


  //
  // var matchedTodo = _.findWhere(todos,{id: todoID});
  // if(!matchedTodo){
  //   res.status(200).json({"error":'Item is deleted'});
  // }else{
  //   todos = _.without(todos,matchedTodo);
  //   res.json(matchedTodo);
  // }
  //
  //




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

app.put('/todos/:id',function(req,res){
  var body = req.body;
  var todoID = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos,{id: todoID});
  if(!matchedTodo){
    return res.status(404).send({"error":'there is no data with id ' + todoID});
  }

  var body = _.pick(body,'id','description','completed');
  var validAttributes ={};

  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttributes.completed = body.completed;
  }else if(body.hasOwnProperty('completed')){
    return res.status(400).send({"error":'its not boolean'});
  }

  if(body.hasOwnProperty('description')){
    if(_.isString(body.description) && body.description.trim().length>0){
      validAttributes.description = body.description.trim();
    }else if(body.hasOwnProperty('completed')){
      return res.status(400).send({"error":'its not string'});
    }
  }
  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});


db.sequelize.sync().then(function(){
  app.listen(PORT,function(){
    console.log('Express listening on port '+PORT+'!');
  });
}).catch(function(){
  console.error("Error in sync db!");
});

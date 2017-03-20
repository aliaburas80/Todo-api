var express = require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var db = require('./db.js');
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
      });
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
});

app.put('/todos/:id',function(req,res){
  var todoID = parseInt(req.params.id);
  var body = _.pick(req.body,'description','completed');
  var attributes = {};

  if(body.hasOwnProperty('completed')){
    attributes.completed = body.completed;
  }

  if(body.hasOwnProperty('description')){
    attributes.description = body.description;
  }

  db.todo.findById(todoID).then(
    function(item){
      if(item){
          return item.update(attributes);
      }else{
        res.status(404).send();
      }
    },function(error){
        res.status(500).send();
    }
  ).then(
    function(item){
      res.json(item.toJSON());
    },function(error){
        res.status(400).json({error:error});
    }
  );
});

/*
  user module
*/

app.post('/user',function(req,res){
  var body = _.pick(req.body,'email','password');
  console.log(body);
  db.user.create({
    email    : body.email,
    password : body.password
  }).then(function(item){
    res.status(200).send('\n Login success! \n email:'+item.toJSON().email + '\n password:'+item.toJSON().password);
  }).catch(function(error){
    console.error(error);
    res.status(400).json({"message":error.errors[0].message, "where":error.errors[0].path});
  });

});


db.sequelize.sync().then(function(){
  app.listen(PORT,function(){
    console.log('Express listening on port '+PORT+'!');
  });
}).catch(function(){
  console.error("Error in sync db!");
});

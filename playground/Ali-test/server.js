var express = require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var db = require('./dbConnection');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/person',function(req,res){
  if(req.body){
    var body =  req.body;
    if(_.isString(body.name ) ||
       _.isNumber(body.age)   ||
       body.name.len > 0){
         db.data.create({
           name : body.name,
           age  : body.age,
          address  : body.address
        }).then(function(item){
            res.status(200).send('Data saved!')
        }).catch(function(e){
          console.error(e);
          res.status(400).send(e.toJSON())
       });
  }else{
    console.error('No data was sent!');
  }
}});


db.data.sync().then(function(){
  app.listen(PORT,function(){
    console.log('Express listening on port '+PORT+'!');
  });
}).catch(function(e){
  console.error(e);
});

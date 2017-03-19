var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
  'dialect':'sqlite',
  'storage':__dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{ // create table todo
  description:{ // add database feilds
    type:Sequelize.STRING,
    allowNull:false,
    validate:{
    //  notEmpty:true// cant be empty string
      len:[1,250] // the string is valid if its between 1 - 250 letter
    }
  },
  completed:{
    type:Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:false
  }
});

sequelize.sync({force:true}).then(function(){ // push to table some data.
  console.log('Everything is synced');
/*
for(var a=0;a<10;a++){
  Todo.create({ // here we create new database item to table
    description:'Ali Abu Ras'+Math.ceil(Math.random()*1000).toString(),
    completed:true
  }).then(function(todo){
    console.log('Finished ');
  //  console.log(todo);
  });
}
*/
Todo.create({ // here we create new database item to table
  description:'Take out trash',
  completed:true
}).then(function(todo){
  console.log('Finished ');
//  console.log(todo);
}).catch(function(e){
  console.log(e);
});


Todo.create({ // here we create new database item to table
  description:'Without boolean'
}).then(function(todo){
    console.log('Finished ');
    return Todo.create({
      description:'Clean Offic'
    })
}).then(function(todo){
  //  return Todo.findById(1);
  return Todo.findAll({
    where:{
      completed:false,
      description:{
        $like : "%ea%"
      }
    }
  })
}).then(function (todos){
  if(todos){
    todos.forEach(function(todo){
      console.log(todo.toJSON());
    });
  }else{
    console.log('No todo found!');
  }
}).catch(function(e){
  console.log(e);
});


})

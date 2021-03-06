var Sequelize = require('sequelize');
var env = process.env.NODE_EN || 'development';
var sequelize;

if(env === 'production'){
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:'postgres'
  });
}else{
   sequelize = new Sequelize(undefined,undefined,undefined,{
    'dialect':'sqlite',
    'storage':__dirname + '/data/dev-todo-api.sqlite'
  });
}

// old code
// var sequelize = new Sequelize(undefined,undefined,undefined,{
//   'dialect':'sqlite',
//   'storage':__dirname + '/data/dev-todo-api.sqlite'
// });
//
var db ={};
db.todo = sequelize.import(__dirname + '/models/todo.js');// to load modules from superated files
db.user = sequelize.import(__dirname + '/models/user.js');// to load modules from superated files
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

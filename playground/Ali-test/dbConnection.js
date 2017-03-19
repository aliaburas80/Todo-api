var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
  'dialect':'sqlite',
  'storage':__dirname + '/data/dev-api.sqlite'
});

var db = {};

db.data = sequelize.import(__dirname + '/models/createTable.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

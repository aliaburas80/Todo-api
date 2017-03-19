module.exports = function(sequelize, Datatypes){
  return sequelize.define('todo',{ // create table todo
    description:{ // add database feilds
      type:Datatypes.STRING,
      allowNull:false,
      validate:{
      //  notEmpty:true// cant be empty string
        len:[1,250] // the string is valid if its between 1 - 250 letter
      }
    },
    completed:{
       type:Datatypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
  });
};

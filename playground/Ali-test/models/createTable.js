module.exports = function(sequelize, Datatypes){
  //
  return sequelize.define(
    'person',{ // create table todo
        name:{ // add database feilds
          type:Datatypes.STRING,
          allowNull:false,
          validate:{
            len:[1,250]
          }
        },
        age:{
           type:Datatypes.INTEGER,
            allowNull:false,
            defaultValue:25
        },
        address:{
          type:Datatypes.STRING,
          allowNull:true,
          validate:{
           notEmpty:false// cant be empty string
          }
        }
    }
  );
  //
};

var bcrypt = require('bcrypt');
var _=require('underscore');

module.exports = function(seq,DataTypes){
  return seq.define('user',{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
          isEmail:true
        }
    },
    salt:{// adding random set of character at end of password
      type:DataTypes.STRING
    },
    password_hash:{
      type:DataTypes.STRING
    },
    password:{
          type:DataTypes.VIRTUAL,// dont save in database but its accessable, and its over the set functionality
          allowNull:false,
          validate:{
            len : [7,100]
          },
          set:function(value){// value of that faild
            var salt = bcrypt.genSaltSync(10); // generat new salt
            var hashedPassword = bcrypt.hashSync(value,salt);//
            this.setDataValue('password',value); // saved on db
            this.setDataValue('salt',salt); // saved on db
            this.setDataValue('password_hash',hashedPassword); // saved on db
          }
        }
      },{
        hooks:{
          beforeValidate: function(user,options){
            // to set email letters to lowercase
            // and check if its a string on not.
            // to make sure this email already excess in database or not.
              if(typeof user.email === 'string'){
                user.email = user.email.toLowerCase();
              }
          }
        },
          instanceMethods: {
            toPublicJSON: function () {
              var json = this.toJSON();
              return _.pick(json, 'id', 'createdAt', 'updatedAt', 'email');
            }
        }
  })
}

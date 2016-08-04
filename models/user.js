//define new model using arguments passed in for users
//models/validate sequelize
var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  //create variable so we can access it within
  var user = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING,
    },
    password_hash: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7,100]
      },
      set: function(value) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    }
  }, {
    hooks: {
      beforeValidate: function(user, options) {
        //user.email
        if (typeof(user.email) == "string" && user.email.trim().length >  0)
        {
          user.email = user.email.toLowerCase();
        }
      }
    },
    classMethods: {
      //class methods work of db class
      authenticate: function(body) {
        return new Promise(function(resolve, reject) {
          //check if valid account
          if (typeof(body.email) != 'string' || typeof(body.password) != 'string')
          {
            //send when account is not valid
            return reject();
          } else
          {
            user.findOne({
              where: {
                email: body.email
              }
            }).then(function(user) {
              //no user or password incorrect
              if (!user || !bcrypt.compareSync(body.password, user.get('password_hash')))
              {
                //401 = unauthorized
                return reject();
              } else
              {
                resolve(user);
              }

            }, function(e) {
              reject();
            });
          }
        })
      }
    },
    instanceMethods: {
      //instance methods work of user instances
      toPublicJSON: function() {
          //this refers to instance
          var json = this.toJSON();
          return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
      },
      generateToken: function(type) {
        if (!_.isString(type))
        {
          return undefined;
        } else
        {
          try {
            //encypting user information inside a token
            //data to encrypt and turns to json string
            var stringData = JSON.stringify({
              id: this.get('id'),
              type: type
            });
            //AES only encrypt strings, return encrypted string
            var encryptedData = cryptojs.AES.encrypt(stringData, "abc123!@").toString();
            //create JSON token
            var token = jwt.sign({
              token: encryptedData
            }, "qwerty098");
            return token;
          } catch(e) {
            console.error(e);
            return undefined;
          }
        }
      }
    }
  });

  //return for good use
  return user;
};

//store tokens of logged in users
var cryptojs = require('crypto-js');

module.exports = function(sequelize, DataTypes) {
  //attributes
  return sequelize.define('token', {
    //token attribute for validation
    token: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [1]
      },
      set: function(value) {
        var hash = cryptojs.MD5(value).toString();

        this.setDataValue('token', value);
        this.setDataValue('tokenhash', hash);
      },
    },
    tokenhash: DataTypes.STRING
  });
};

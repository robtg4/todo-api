//we can have other files pass in configuration data
//authentication middleware
var cryptojs = require('crypto-js');

module.exports = function(db) {
  return {
    //middleware defined (runs before api functions)
    requireAuthentication: function(req, res, next) {
      var token = req.get('Auth') || '';

      //looking for token set in auth header
      db.token.findOne({
        where: {
          tokenhash: cryptojs.MD5(token).toString()
        }
      }).then(function(tokenInstance) {
        if (!tokenInstance) {
          throw new Error();
        }

        //store onto request object
        req.token = tokenInstance;
        return db.user.findByToken(token);
        //find user
      }).then(function(user) {
        req.user = user;
        next();
      }).catch(function() {
        res.status(401).send();
      });

    }
  };
};

//we can have other files pass in configuration data
//authentication middleware
module.exports = function(db) {
  return {
    //middleware defined (runs before api functions)
    requireAuthentication: function(req, res, next) {
      var token = req.get('Auth');
      db.user.findByToken(token).then(function(user) {
        req.user = user;
        next();
      }, function(e) {
        res.status(401).send(token);
      });
    }
  };
};

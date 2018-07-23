var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


var Usuario = require('../models/Usuario');
var config = require('../config/database');

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Usuario.findOne({id: jwt_payload.id}, function(err, usuario) {
          if (err) {
              return done(err, false);
          }
          if (usuario) {
              done(null, usuario);
          } else {
              done(null, false);
          }
      });
  }));
};
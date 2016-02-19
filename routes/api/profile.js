var Joi    = require('joi');
var Bcrypt = require('bcrypt');


exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/profile',
      config: {
        handler: function(request, reply) {
            return reply("apiprofile");
        }
      }
    },

  ]);

  next();
};

exports.register.attributes = {
  name: 'profile-api',
  version: '0.0.1'
};
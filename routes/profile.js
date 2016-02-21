var Authenticated = require("./modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/profile',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

            if (result.authenticated) {
              var currentUser = ObjectID(result.user_id);
              db.collection("users").findOne({"_id": currentUser}, function (err, user){
                if (err) { return reply(err).code(400); }

                if (user === null) {
                  return reply.view("templates/profile", {authenticated: true, user: null});
                }

                db.collection("events").find({"creator_id": currentUser}).toArray(function (error, events){
                  if (err) { return reply(error).code(400); }

                  var fullName = user.firstName+" "+user.lastName;
                  return reply.view("templates/profile", {authenticated: true, user: user, events: events, name: fullName});
                });
              });
            } else {
              return reply.redirect('/');
            }
          })
        }
      }
    },

  ]);

  next();
};

exports.register.attributes = {
  name: 'profile-view',
  version: '0.0.1'
};
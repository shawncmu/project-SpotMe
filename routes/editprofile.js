var Authenticated = require("./modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: "/editprofile",
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

            if (result.authenticated) {
              db.collection("users").findOne({"_id": ObjectID(result.user_id)}, function (err, user){
                if (err) { return reply(err).code(400); }
                var fullName = user.firstName+" "+user.lastName;
                var image = user.image;

                if (user === null) {
                  return reply.view("templates/editprofile", {authenticated: true, user: null});
                }

                return reply.view("templates/editprofile", {authenticated: true, user: user, name: fullName, image: image});
              });
            } else {
                return reply.redirect('/');
            }
          });
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'editprofile-view',
  version: '0.0.1'
};
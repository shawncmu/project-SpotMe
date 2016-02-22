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

                db.collection("events").find({$and:[{"creator_id": currentUser}, {"partner_id": null}]}).toArray(function (error, myEvents){
                  if (err) { return reply(error).code(400); }

                  db.collection("events").find({$or:[{$and:[{"creator_id": currentUser}, {"partner_id": {$ne: null}}]}, {"partner_id": currentUser}]}).toArray(function (errors, joinedEvents){
                    if (errors) { return reply(errors).code(400); }

                    var fullName = user.firstName+" "+user.lastName;
                    var image = user.image;
                    return reply.view("templates/profile", {authenticated: true, user: user, myEvents: myEvents, joinedEvents: joinedEvents, name: fullName, image: image});
                  });
                });
              });
            } else {
              return reply.redirect('/');
            }
          })
        }
      }
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'profile-view',
  version: '0.0.1'
};
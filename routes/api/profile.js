var Authenticated = require("../modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/viewprofile/{selectedProfile}',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
            var creatorProfile = ObjectID(request.params.selectedProfile);

            db.collection("users").findOne({"_id": creatorProfile}, function (err, user){
                if (err) { return reply(err).code(400); }

                var profile = {
                  image: user.image,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  dateOfBirth: new Date(user.dateOfBirth),
                  experience: user.experience || "Not Specified",
                  gender: user.gender,
                  height: user.height || "Not Specified",
                  weight: user.weight || "Not Specified",
                  memberships: user.memberships || "Not Specified"
                };
                return reply(profile).code(200);
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
  name: 'profile-api',
  version: '0.0.1'
};
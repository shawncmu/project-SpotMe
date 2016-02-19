exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/profile',
      config: {
        handler: function(request, reply) {

          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
          var session = request.yar.get('hapi_spotme_session');

          var currentUser = ObjectID(session.user_id);

          db.collection("users").findOne({"_id": currentUser}, function (err, user){
            if (err) { return reply(err).code(400); }

            db.collection("events").find({"creator_id": currentUser}).toArray(function (error, events){
              if (err) { return reply(error).code(400); }

              return reply.view("templates/profile", {user: user, events: events});
            });
          });
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
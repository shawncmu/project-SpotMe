var Authenticated = require("./modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/events',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

            if (result.authenticated) {
              db.collection("users").find({"_id": ObjectID(result.user_id)}, function (err, user){
                if (err) { return reply(err).code(400); }
                var fullName = user.firstName+" "+user.lastName;
              //if (request.payload.activity)
              //number spots needed/spot limit use $inc and have field for avail spots
                db.collection("events").find({"event_time": request.payload.dateTime}, function (err, event1){
                  if (err) { return reply(err).code(400); }

                  // if (event1 === null) {
                  //   return reply.view("templates/search", {authenticated: true, user: null});
                  // }

                  db.collection("events").find({"creator_id": currentUser}).toArray(function (error, events){
                    if (err) { return reply(error).code(400); }


                    return reply.view("templates/search", {authenticated: true, events: event1, name: fullName});
                  });
                });
              });
            } else {
                return reply.redirect('/');
            }
          });
        }
      }
    },

  ]);

  next();
};

exports.register.attributes = {
  name: 'events-view',
  version: '0.0.1'
};
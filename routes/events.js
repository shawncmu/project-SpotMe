var Authenticated = require("./modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: "/events/",
      config: {
        handler: function(request, reply) {

          var dateFilter = request.query.dateAndTime || /(.*)/;
          var locationFilter = request.query.place || /(.*)/;
          var activityFilter = request.query.activity || /(.*)/;

          Authenticated(request, function (result) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

            if (result.authenticated) {
              db.collection("users").findOne({"_id": ObjectID(result.user_id)}, function (err, user){
                if (err) { return reply(err).code(400); }

                var fullName = user.firstName+" "+user.lastName;
              //number spots needed/spot limit use $inc and have field for avail spots
                db.collection("events").find({$and: [{"event_time": dateFilter},{"event_location": locationFilter},{"event_type": activityFilter}]}).toArray( function (error, events){
                  if (error) { return reply(error).code(400); }

                  return reply.view("templates/events", {authenticated: true, user: user, events: events, name: fullName});
                });
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
  name: 'events-view',
  version: '0.0.1'
};
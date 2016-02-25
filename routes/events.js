var Authenticated = require("./modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'GET',
      path: "/events/",
      config: {
        handler: function(request, reply) {

          var dateParam = request.query.date ? new Date(request.query.date) : new Date();
          var startDate = new Date(dateParam.getTime()-43200000);
          var endDate = new Date(dateParam.getTime() + 86400000);

          var locationFilter = request.query.place;
          var activityFilter = request.query.activity || /(.*)/;
          var timeFilter = request.query.time || /(.*)/;

          Authenticated(request, function (result) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

            if (result.authenticated) {
              db.collection("users").findOne({"_id": ObjectID(result.user_id)}, function (err, user){
                if (err) { return reply(err).code(400); }

                var fullName = user.firstName+" "+user.lastName;
                var image = user.image;

                db.collection("events").find({$and: [{"partner_id":null},{"event_date": {$gte: startDate, $lte: endDate}},{"event_location": {$regex: locationFilter+".*"}},{"event_type": {$in:[activityFilter]}},{"event_time": timeFilter}]}).toArray( function (error, events){
                  if (error) { return reply(error).code(400); }

                  var query = {
                    dateResult: request.query.date || "All",
                    timeResult: request.query.time || "All",
                    locationResult: request.query.place || "All",
                    activityResult: request.query.activity || "All"
                  }
                  db.collection("locations").find({}).toArray(function (nope, allLocations){
                    if (nope) { return reply(nope).code(400); }

                    return reply.view("templates/events", {authenticated: true, user: user, events: events, name: fullName, image: image, query: query, locations: allLocations});
                  });
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
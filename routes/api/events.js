var Joi    = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next) {
  server.route([
    { // Create a new event
      method: 'POST',
      path: '/api/events',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload;
          console.log(user);

          // query to find existing user
          var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
          var session = request.yar.get('hapi_spotme_session');
          var currentUser = ObjectID(session.user_id);
          var isTimeAvail = {timing: user.timing};

          db.collection('events').findOne({$and:[{"_id":currentUser}, {"event_time": isTimeAvail}]}, function(err, slotFull){
            if (slotFull) {
              return reply('Error: Timeslot already occupied', err).code(400);
            }

            newEvent = {
              creator_id: currentUser,
              partner_id: null,
              event_time: user.timing,
              event_type: user.activity,
              event_location: "test"
            }

            // Now, add the new user into the database
            db.collection('events').insert(newEvent, function(err, doc) {
              if (err) { return reply('Internal MongoDB error', err).code(400); }
              console.log(newEvent);
              reply(doc).code(200);
            });
          });
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'events-api',
  version: '0.0.1'
};
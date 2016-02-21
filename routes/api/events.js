var Joi    = require('joi');
var Bcrypt = require('bcrypt');
var Authenticated = require("../modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    { // Create a new event
      method: 'POST',
      path: '/api/events',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload;

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
              event_location: "test",
              //available_spot: 1
            }

            // Now, add the new user into the database
            db.collection('events').insert(newEvent, function (err, doc) {
              if (err) { return reply('Internal MongoDB error', err).code(400); }
              reply(doc).code(200);
            });
          });
        }
      }
    },
    {
      method: 'PUT',
      path: '/api/joinevent',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
              var currentUser = ObjectID(result.user_id);
              var event_id = ObjectID(request.payload.selectedEvent);
              db.collection("events").findOne({"_id": event_id}, function(err, matchEvent){
                if (err) { return reply('Internal MongoDB error', err).code(400); }
                console.log(matchEvent.partner_id);
                if (matchEvent.partner_id === null) {
                  db.collection("events").update({"_id": event_id}, {$set: {partner_id: currentUser}}, function (err, doc) {
                    if (err) { return reply('Internal MongoDB error', err).code(400); }
                    reply(doc).code(200);
                  });
                } else {
                  return reply('Error: No spot available', err).code(400);
                }
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
  name: 'events-api',
  version: '0.0.1'
};
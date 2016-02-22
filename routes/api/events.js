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
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var user = request.payload;

              var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
              var session = request.yar.get('hapi_spotme_session');
              var currentUser = ObjectID(session.user_id);
              var isTimeAvail = {timing: user.timing};

              db.collection("users").findOne({"_id":ObjectID(result.user_id)},function (error, creatorInfo) {
                if (error) { return reply('Internal MongoDB error', error).code(400); }

                db.collection('events').findOne({$and:[{"_id":currentUser}, {"event_time": isTimeAvail}]}, function (err, slotFull){
                  if (slotFull) {
                    return reply('Error: Timeslot already occupied', err).code(400);
                  }

                  newEvent = {
                    creator_id: currentUser,
                    creator_rating: creatorInfo.rating,
                    creator_image: creatorInfo.image,
                    creator_name: creatorInfo.firstName + " " + creatorInfo.lastName,
                    partner_id: null,
                    partner_rating: null,
                    partner_image: null,
                    partner_name: null,
                    event_time: user.timing,
                    event_date: user.date,
                    event_type: user.activity,
                    event_location: user.location
                  }

                  // Now, add the new user into the database
                  db.collection('events').insert(newEvent, function (err, doc) {
                    if (err) { return reply('Internal MongoDB error', err).code(400); }
                    console.log(doc);
                    reply(doc).code(200);
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
              db.collection("users").findOne({"_id": currentUser}, function (error, joiner){
                if (error) { return reply('Internal MongoDB error', error).code(400); }
                db.collection("events").findOne({"_id": event_id}, function(err, matchEvent){
                  if (err) { return reply('Internal MongoDB error', err).code(400); }
                  var fullName = joiner.firstName+" "+joiner.lastName;

                  if (matchEvent.partner_id === null) {
                    db.collection("events").update({"_id": event_id}, {$set: {partner_id: currentUser, partner_rating: joiner.rating, partner_image: joiner.image, partner_name: fullName}}, function (err, doc) {
                      if (err) { return reply('Internal MongoDB error', err).code(400); }
                      reply(doc).code(200);
                    });
                  } else {
                    return reply('Error: No spot available', err).code(400);
                  }
                });
              });
            } else {
                return reply.redirect('/');
            }
          });
        }
      }
    },
    {
      method: 'DELETE',
      path: '/api/events',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
              var removeEvent = ObjectID(request.payload.removeEvent);

              db.collection("events").remove({"_id": removeEvent}, function (err, doc) {
                if (err) { return reply('Internal MongoDB error', err).code(400); }

                  reply(doc).code(200);
              });
            } else {
                return reply.redirect('/');
            }
          });
        }
      }
    },
    {
      method: 'DELETE',
      path: '/api/unjoinevents',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;
              var unjoinEvent = ObjectID(request.payload.unjoinEvent);

              db.collection("events").update({"_id": unjoinEvent},{$set:{partner_id: null, partner_rating: null, partner_image: null, partner_name: null}}, function (err, doc) {
                if (err) { return reply('Internal MongoDB error', err).code(400); }

                  reply(doc).code(200);
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
var Joi    = require('joi');
var Bcrypt = require('bcrypt');

var randomKeyGenerator = function () { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); };

exports.register = function(server, options, next) {
  server.route([
    { // Create a new user
      method: 'POST',
      path: '/api/signup',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload;

          // query to find existing user
          var uniqUserQuery = {email: user.email};

          db.collection('users').findOne(uniqUserQuery, function(err, userExist){
            if (userExist) {
              return reply('Error: Username/Email already exist', err).code(400);
            }

            // Now, add the new user into the database
            Bcrypt.genSalt(10, function(err, salt) {
              Bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;

                // Store hash in your password DB.
                db.collection('users').insert(user, function(err, doc) {
                  if (err) { return reply('Internal MongoDB error', err).code(400); }
                  console.log(doc);
                  reply(doc).code(200);
                });
              });
            });
          });
        },
        validate: {
          payload: {
            firstName: Joi.string().min(2).max(20).required(),
            lastName: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().max(50).required(),
            password: Joi.string().min(4).max(20).required(),
            dateOfBirth: Joi.date(),
            gender: Joi.string().min(4).max(6).required(),
            experience: Joi.empty(),
            height: Joi.empty(),
            weight: Joi.empty(),
            memberships: Joi.empty(),
            rating: Joi.empty()
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/api/signin',
      config: {
        handler: function(request, reply) {
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload;

          db.collection('users').findOne({ "email": user.email }, function(err, userMongo) {
              if (err) { return reply('Internal MongoDB error', err).code(400); }

              if (userMongo === null) {
                return reply({ "message": "User doesn't exist" }).code(400);
              }

              Bcrypt.compare(user.password, userMongo.password, function(err, result) {
                // If password matches, please authenticate user and add to cookie
                if (result) {

                  var newSession = {
                    "session_id": randomKeyGenerator(),
                    "user_id": userMongo._id
                  };

                  db.collection('sessions').insert(newSession, function(err, result) {
                    if (err) {
                      return reply('Internal MongoDB error', err).code(400);
                    }

                    // Store the Session information in the browser Cookie
                    request.yar.set('hapi_spotme_session', newSession); // CHANGE-ME

                    return reply({ "message:": "Authenticated" }).code(200);
                  });
                } else {
                  reply({ message: "Not authorized" }).code(400);
                }
              });
          });
        },
        validate: {
          payload: {
            email: Joi.string().email().max(50).required(),
            password: Joi.string().min(4).max(20).required()
          }
        }
      }
    },
    {
      method: 'DELETE',
      path: '/api/signout',
      handler: function(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var session = request.yar.get('hapi_spotme_session'); // CHANGE-ME

        if (!session) {
          return reply({ "message": "Already logged out" }).code(400);
        }

        db.collection('sessions').remove({ "session_id": session.session_id }, function(err, doc) {
          if (err) { return reply('Internal MongoDB error', err).code(400); }

          reply(doc).code(200);
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'auth-api',
  version: '0.0.1'
};

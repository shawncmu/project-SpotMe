var Joi    = require('joi');
var Bcrypt = require('bcrypt');
var Authenticated = require("../modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    {
      method: 'PUT',
      path: '/api/editmyprofile',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins["hapi-mongodb"].ObjectID;

              var newInfo = {
                email: request.payload.email,
                firstName: request.payload.firstName,
                lastName: request.payload.lastName,
                dateOfBirth: request.payload.dateOfBirth,
                experience: request.payload.experience,
                gender: request.payload.gender,
                height: request.payload.height,
                weight: request.payload.weight,
                memberships: request.payload.memberships,
              };
              db.collection("users").findOne({"_id": ObjectID(result.user_id)}, function (err, user){
                if (err) { return reply(err).code(400); }

                Bcrypt.compare(request.payload.password, user.password, function (error, passed) {
                    console.log(passed);
                  if (passed) {

                    if (user.email != request.payload.email) {
                      db.collection('users').findOne({"email": request.payload.email}, function(error2, userExist){
                        if (userExist) {
                          return reply('Error: Username/Email already exist', error2).code(400);
                        }
                      });
                    } else {
                      db.collection("users").update({"_id": ObjectID(result.user_id)}, {$set: newInfo}, function (errors, updatedUser){
                        if (errors) { return reply(errors).code(400); }

                        reply (updatedUser).code(200);
                      });
                    }
                  } else {
                    return reply({ message: "Not authorized" }).code(400);
                  };
                });
              });
            } else {
                return reply.redirect('/');
            }
          });
        }
        // validate: {
        //   payload: {
        //     firstName: Joi.string().min(2).max(20).required(),
        //     lastName: Joi.string().min(2).max(20).required(),
        //     email:    Joi.string().email().max(50).required(),
        //     //dateOfBirth: Joi.date().required(),
        //     gender: Joi.string().min(4).max(6).required(),
        //     experience: Joi.string().min(2).max(20).required(),
        //     height: Joi.number().integer().min(100).max(300).required(),
        //     weight: Joi.number().integer().min(50).max(500).required(),
        //     memberships: Joi.string().min(2).max(50).required()
        //   }
        // }
      }
    }
    // {
    //   method: 'DELETE',
    //   path: '/api/deleteprofile',
    //   handler: function(request, reply) {
    //     var db = request.server.plugins['hapi-mongodb'].db;
    //     var session = request.yar.get('hapi_spotme_session'); // CHANGE-ME

    //     if (!session) {
    //       return reply({ "message": "Already logged out" }).code(400);
    //     }

    //     db.collection('sessions').remove({ "session_id": session.session_id }, function(err, doc) {
    //       if (err) { return reply('Internal MongoDB error', err).code(400); }

    //       reply(doc).code(200);
    //     });
    //   }
    // }
  ]);

  next();
};

exports.register.attributes = {
  name: 'editprofile-api',
  version: '0.0.1'
};
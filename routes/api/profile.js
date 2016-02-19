var Joi    = require('joi');
var Bcrypt = require('bcrypt');
var Authenticated = require("../modules/authenticated.js");

exports.register = function(server, options, next) {
  server.route([
    // {
    //   method: 'GET',
    //   path: '/api/profile',
    //   config: {
    //     handler: function(request, reply) {
    //         return reply("apiprofile");
    //     }
    //   }
    // },
    {
      method: 'PUT',
      path: '/api/editprofile',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var session = request.yar.get("hapi_spotme_session");
            var user_id = ObjectID(session.user_id);

            var id = ObjectID(request.params.id);
            var updateDoughnut = {
              style:  request.payload.style,
              flavor: request.payload.flavor
            }

            db.collection("doughnuts").findOne({"_id": id}, function (err, doughnut){
              if (err) { return reply(err).code(400);}

              // check if doughnut exists
              if (doughnut === null) {
                return reply({message: "There is no doughnut"}).code(404);
              }

              if (doughnut.user_id.toString() === user_id.toString()) {
                db.collection('doughnuts').update({"_id": id},{$set: updateDoughnut}, function (err, doughnut) {
                    if (err) { return reply(err); }
                    reply(doughnut).code(200);
                });
              } else {
                reply ({message: "This is not your doughnut"}).code(400);
              }
            });
          } else {
            reply.view('auth/signin', {message: request.query.message});
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
var Authenticated = require("./modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    { // serving static files
      method: 'GET',
      path: "/public/{path*}",
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    { // Home Page
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            reply.redirect("/profile").code(307);
          } else {
              var data = result; // need to have auhtenticated inorder to show signout button
              reply.view('static_pages/home', data).code(200);
          }
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'static-pages-views',
  version: '0.0.1'
};

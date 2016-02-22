var Authenticated = require("./modules/authenticated.js");

exports.register = function (server, options, next) {
  server.route([
    { // Make Quiz
      method: "GET",
      path: '/quiz_make',
      handler: function (request, reply) {
        Authenticated(request, function(result){
          if (result.authenticated) {
            reply.view('quizzes/quiz_make.html', result);
          } else {
            reply.redirect('/signin');
          }
        });
      }
    },
    { // Take Quiz
      method: "GET",
      path: '/quiz_take/{id}',
      handler: function (request, reply) {
        Authenticated(request, function(result){
          if (result.authenticated) {
            var data = {
              authenticated: result.authenticated
            }

            reply.view('quizzes/quiz_take.html', result);
          } else {
            reply.redirect('/signin');
          }
        });
      }
    },
    { // Choose Quiz
      method: "GET",
      path: '/quiz_choose',
      handler: function (request, reply) {
        Authenticated(request, function(result){
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;

            db.collection('quizzes').find().toArray(function (err, quizzes) {
              if (err) { return reply(err).code(400); }

              var data = {
                authenticated: result.authenticated,
                quizzes: quizzes
              }

              reply.view('quizzes/quiz_choose.html', data);
            });
          } else {
            reply.redirect('/signin');
          }
        });
      },
    }

  ]);

  next();
};

exports.register.attributes = {
  name: 'quizzes-views',
  version: '0.0.1'
};

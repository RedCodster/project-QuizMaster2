var Joi    = require('joi');
var Bcrypt = require('bcrypt');
var Authenticated = require('../modules/authenticated');

exports.register = function(server, options, next) {
  server.route([
    {
      method: "GET",
      path: "/api/quizzes/{quiz_id}/questions",
      handler: function (request, reply) {
        Authenticated(request, function (result) {
          if (result.authenticated) {
            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var quiz_id = ObjectID(request.params.quiz_id);

            db.collection('questions').find({quiz_id: quiz_id}).toArray(function (err, questions) {
              if (err) { return reply(err).code(400); }

              reply(questions).code(200);
            });
          } else {
            reply(result).code(400);
          }
        })
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'questions-api',
  version: '0.0.1'
};
var Joi    = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next) {
  server.route([
    { // Create a new quiz
      method: 'POST',
      path: '/api/quizzes',
      config: {
        handler: function(request, reply) {
          console.log(request);
          console.log('/api/quizzes');
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var session = request.yar.get('');
          var newQuiz = request.payload;
          var totalQuiz = {
            'user_id': ObjectID(session.user_id),
            'name': newQuiz.quizName,
            'topic': newQuiz.quizTopic,
            'questionSet': newQuiz.questionSet
          }

          db.collection('quizzes').insert(newQuiz, function(err, doc){
            if (err) { return reply('Internal MongoDB error', err).code(400); }

                reply(doc).code(200);
              });

          };
      }
    }

    // {
    //   method: 'DELETE',
    //   path: '/api/quizzes',
    //   handler: function(request, reply) {
    //     var db = request.server.plugins['hapi-mongodb'].db;
    //     var session = request.yar.get('hapi_qm2_session'); // CHANGE-ME

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
  name: 'quizzes-api',
  version: '0.0.1'
};
var Joi    = require('joi');
var Bcrypt = require('bcrypt');
var Authenticated = require('../modules/authenticated');

exports.register = function(server, options, next) {
  server.route([
    { // Create a new quiz
      method: 'POST',
      path: '/api/quizzes',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
              var newQuiz = request.payload;
              var quizLength = newQuiz.quizLength;
              var quizInfo = {
                'user_id': ObjectID(result.user_id),
                'name': newQuiz.quizName,
                'topic': newQuiz.quizTopic
              };

              db.collection('quizzes').insert(quizInfo, function(err, createdQuiz){
                if (err) { return reply('Internal MongoDB error', err).code(400); }

                var quiz = createdQuiz.ops[0];
                var questionSet = [];
                for (i=0; i < quizLength; i++) {
                  var obj = {};
                  obj.question = newQuiz['questionSet[' + i + '][question]'];
                  obj.answer = newQuiz['questionSet[' + i + '][answer]'];
                  obj.dummy1 = newQuiz['questionSet[' + i + '][dummy1]'];
                  obj.dummy2 = newQuiz['questionSet[' + i + '][dummy2]'];
                  obj.url = newQuiz['questionSet[' + i + '][url]'];
                  obj.quiz_id = ObjectID(quiz._id);
                  questionSet.push(obj);
                }

                console.log(questionSet);
                db.collection('questions').insert(questionSet, function(err, set){
                  if (err) { return reply('Internal MongoDB error', err).code(400); }

                  console.log(set);
                  reply({message: 'You have successfully created a new quiz ' + 'name'}).code(200);
                });
              });
            } else {
              return reply(result).code(400);
            }
          })
        }
      }
    },
    { // Update a quiz
      method: 'PUT',
      path: '/api/quizzes/{id}',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
              var updateQuiz = request.payload;
              var quizLength = parseInt(updateQuiz.quizLength);

              var quiz_id  = ObjectID(request.params.id);
              var user_id  = ObjectID(result.user_id);

              var updateQuizInfo = {
                'name': updateQuiz.quizName,
                'topic': updateQuiz.quizTopic
              };

              db.collection('quizzes').updateOne({"_id": quiz_id}, {$set : updateQuizInfo}, function(err, upatedQuiz){
                if (err) { return reply('Internal MongoDB error', err).code(400); }

                db.collection('questions').remove({'quiz_id': quiz_id}, function (err, set) {
                  if (err) { return reply('Internal MongoDB error', err).code(400); }

                    var questionSet = [];
                    console.log(updateQuiz);
                    for (i=0; i < quizLength; i++) {
                      var obj = {};

                      obj.question = updateQuiz['questionSet[' + i + '][question]'];
                      obj.answer = updateQuiz['questionSet[' + i + '][answer]'];
                      obj.dummy1 = updateQuiz['questionSet[' + i + '][dummy1]'];
                      obj.dummy2 = updateQuiz['questionSet[' + i + '][dummy2]'];
                      obj.url = updateQuiz['questionSet[' + i + '][url]'];
                      obj.quiz_id = quiz_id;

                      questionSet.push(obj);
                    }

                    console.log(questionSet);

                    db.collection('questions').insert(questionSet, function(err, set2){
                      if (err) { return reply('Internal MongoDB error', err).code(400); }

                      console.log(set2);
                      reply(set2).code(200);
                    });
                  });
                });
              } else {
              return reply(result).code(400);
              }
          });
        }
      }
    },
    { // Delete a quiz
      method: 'DELETE',
      path: '/api/quizzes/{id}',
      config: {
        handler: function(request, reply) {
          Authenticated(request, function (result) {
            if (result.authenticated) {
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
              var updateQuiz = request.payload;
              var quiz_id = ObjectID(request.params.id);
              var user_id = ObjectID(result.user_id);
              db.collection('quizzes').remove({'_id': quiz_id}, function(err, doc){
                if (err) { return reply('Internal MongoDB error', err).code(400); }

                db.collection('questions').remove({'quiz_id': quiz_id}, function (err, doc2) {
                  if (err) { return reply('Internal MongoDB error', err).code(400); }

                  reply({message: "deleted!"}).code(200);
                });
              });
            } else {
              return reply(result).code(400);
            }
          });
        }
      }
    },
  ]);

  next();
};

exports.register.attributes = {
  name: 'quizzes-api',
  version: '0.0.1'
};
var Db= require('mongodb/db').Db,
    mongo= require('mongodb'),
    Server= require('mongodb/connection').Server,
    sys= require('sys'),
    DEFAULT_HOST = "localhost",
    DEFAULT_PORT = 27017;

var newQuizProvider = function newQuizProvider(host, port) {
  host = host === undefined ? DEFAULT_HOST : host;
  port = port === undefined ? DEFAULT_PORT : port;
  db= new Db('node-mongo-quiz', new Server(host, port, {auto_reconnect: true}, {}));
  db.open(function(){});

  var getCollection = function(callback) {
    db.collection('quizes', function(error, quiz_collection) {
      if( error ) callback(error);
      else callback(null, quiz_collection);
    });
  };

  return {
    'findLatest': function(callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          quiz_collection.find({}, { 'sort': 'createdAt', 'limit': 1 }, 
            function(error, cursor) {
              if( error ) callback(error)
              else {
                cursor.toArray(function(error, quiz_collection) {
                  if( error ) callback(error)
                  else callback(null, quiz_collection[0])
                  }
                });
              }
          });
        }
      });
    },
    'findByID': function(id, callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          quiz_collection.find({_id: new mongo.ObjectID(id)}, function(error, result) {
            if( error ) callback(error)
            else callback(null, result[0])
          });
        }
      });
    },
    'save': function(quizes, callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          if( typeof(quizes.length)=="undefined")
            quizes = [quizes];
          for( var i =0;i< quizes.length;i++ ) {
            quiz = quizes[i];
            quiz.created_at = new Date();
            if( quiz.submissions === undefined ) quiz.submissions = [];
            for(var j =0;j< quiz.submissions.length; j++) {
              quiz.submissions[j].created_at = new Date();
            }
          }
          quiz_collection.insert(quizes, function() {
            callback(null, quizes);
          });
        }
      });
    },
    'addSubmissionToArticle': function(quizID, submission, callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback( error );
        else {
          quiz_collection.update(
            {_id: mongo.ObjectID(quizID)},
            {"$push": {submissions: submission}},
            function(error, quiz){
              if( error ) callback(error);
              else callback(null, quiz)
            });
        }
      });
    }
  };
}

exports.newQuizProvider = newQuizProvider;

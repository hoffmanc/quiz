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

  var getCollection = function(cbk) {
    db.collection('quizes', function(e, quiz_collection) {
      if( e ) cbk(e);
      else cbk(null, quiz_collection);
    });
  };

  return {
    'findLatest': function(cbk) {
      getCollection(function(e, quiz_collection) {
        if( e ) cbk(e)
        else {
          quiz_collection.find({}, { 'sort': '-createdAt', 'limit': 1 }, 
            function(e, cursor) {
              if( e ) cbk(e)
              else {
                cursor.toArray(function(e, quiz_collection) {
                  if( e ) cbk(e)
                  else cbk(null, quiz_collection[0])
                });
              }
          });
        }
      });
    },
    'findByName': function(name, cbk) {
      getCollection(function(e, quiz_collection) {
        if( e ) cbk(e)
        else {
          quiz_collection.find({"name": name}, function(e, result) {
            if( e ) cbk(e)
            else cbk(null, result[0])
          });
        }
      });
    },
    'save': function(quizes, cbk) {
      getCollection(function(e, quiz_collection) {
        if( e ) cbk(e)
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
            cbk(null, quizes);
          });
        }
      });
    },
    'addSubmissionToQuiz': function(quizID, submission, cbk) {
      getCollection(function(e, quiz_collection) {
        if( e ) cbk( e );
        else {
          quiz_collection.update(
            {_id: mongo.ObjectID(quizID)},
            {"$push": {submissions: submission}},
            function(e, quiz){
              if( e ) cbk(e);
              else cbk(null, quiz)
            });
        }
      });
    }
  };
}

exports.newQuizProvider = newQuizProvider;

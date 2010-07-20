var Db= require('mongodb/db').Db,
    mongo= require('mongodb'),
    Server= require('mongodb/connection').Server,
    sys= require('sys');

var newQuizProvider= function(host, port) {
  db= new Db('node-mongo-quiz', new Server(host, port, {auto_reconnect: true}, {}));
  db.open(function(){});

  return {
    'getCollection': function(callback) {
      db.collection('quizes', function(error, quiz_collection) {
        if( error ) callback(error);
        else callback(null, quiz_collection);
      });
    },
    'findLatest': function(callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          quiz_collection.find(function(error, cursor) {
            if( error ) callback(error)
            else {
              cursor.toArray(function(error, quiz_collection) {
                if( error ) callback(error)
                else { 
                  quiz_collection.findOne({createdOn: 
                  });
                  callback(null, quiz_collection);
                }
              });
            }
          });
        }
      });
    },
    'findById': function(id, callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          quiz_collection.findOne({_id: new mongo.ObjectID(id)}, function(error, result) {
            if( error ) callback(error)
            else callback(null, result)
          });
        }
      });
    },
    'save': function(articles, callback) {
      getCollection(function(error, quiz_collection) {
        if( error ) callback(error)
        else {
          if( typeof(articles.length)=="undefined")
            articles = [articles];
          for( var i =0;i< articles.length;i++ ) {
            quiz = articles[i];
            quiz.created_at = new Date();
            if( quiz.submissions === undefined ) quiz.submissions = [];
            for(var j =0;j< quiz.submissions.length; j++) {
              quiz.submissions[j].created_at = new Date();
            }
          }
          quiz_collection.insert(articles, function() {
            callback(null, articles);
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

var Db= require('mongodb/db').Db,
    mongo= require('mongodb'),
    Server= require('mongodb/connection').Server,
    sys= require('sys');

QuizProvider = function(host, port) {
  this.db= new Db('node-mongo-quiz', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

QuizProvider.prototype.getCollection= function(callback) {
  this.db.collection('articles', function(error, quiz_collection) {
    if( error ) callback(error);
    else callback(null, quiz_collection);
  });
};

QuizProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, quiz_collection) {
      if( error ) callback(error)
      else {
        quiz_collection.find(function(error, cursor) {
          if( error ) callback(error)
          else {
            cursor.toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null, results)
            });
          }
        });
      }
    });
};

QuizProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, quiz_collection) {
      if( error ) callback(error)
      else {
        quiz_collection.findOne({_id: new mongo.ObjectID(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

QuizProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, quiz_collection) {
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
};

QuizProvider.prototype.addSubmissionToArticle = function(quizID, submission, callback) {
  this.getCollection(function(error, quiz_collection) {
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
};

exports.QuizProvider = QuizProvider;

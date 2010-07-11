var sys = require('sys'),
  kiwi = require('kiwi'),
  client = kiwi.require("redis-client").createClient();

var newQuizProvider = function(){
  return {
    findLatest: function(callback){
      client.sort('quizes','by','publishOn', function(err, sorted) {
        if(err){
          callback(err);
        } else {
          callback(null, sorted[0]);
        }
      });
    },
    findByID: function(id, callback){
      client.set('quiz:' + id + ':publishOn', new Date(), function(err, quiz){
        client.get('quiz:' + id, function(err, quiz) {
          if(err){
            callback(err);
          } else {
            callback(null, quiz);
          }
        });
      });
    }
  }
};

exports.newQuizProvider = newQuizProvider;

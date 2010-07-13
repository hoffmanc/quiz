var sys = require('sys'),
  kiwi = require('kiwi'),
  client = kiwi.require("redis-client").createClient();
client.select(2);

var newQuizProvider = function(){
  return {
    findByID: function(id, callback){
      client.get('quiz:' + id, function(err, quiz) {
        if(err){
          callback(err);
        } else {
          callback(null, quiz);
        }
      });
    }
  }
};

exports.newQuizProvider = newQuizProvider;

var kiwi= require('kiwi');
kiwi.require('express');
kiwi.seed('redis-client');

require('express/plugins');
var quizProvider = require('./quiz-provider-redis').newQuizProvider();

configure(function(){
  use(MethodOverride);
  use(ContentLength);
  use(Logger);
  set('root', __dirname);
})

get('/quiz/*', function(id) {
  var self = this;
  quizProvider.findByID(id, function(err, quizResult){
    if(err){
      self.contentType('text');
      return err;
    } else {
      self.render('quiz-show.html.haml', {
        locals: {
          title: 'Latest Quiz',
          quiz: JSON.parse(quizResult)
        }
      });
    }
  })
});

run();

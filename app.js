var kiwi= require('kiwi'),
  sys = require('sys');
kiwi.require('express');
kiwi.seed('mongodb-native');
require('express/plugins');

var quizProvider = require('./quizprovider-mongodb').newQuizProvider();

configure(function(){
  use(MethodOverride);
  use(ContentLength);
  use(Logger);
  set('root', __dirname);
})

get('/', function() {
  var self = this;
  quizProvider.findLatest(function(err, quizResult){
    self.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: quizResult
      }
    });
  })
});

get('/quiz/*', function(id) {
  var self = this;
  quizProvider.findByID(id, function(err, quizResult){
    if(err){
      self.contentType('text/plain');
      return err;
    }
    self.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: JSON.parse(quizResult)
      }
    });
  })
});

post('/quiz/new' function(id) {
  var self = this;
  quizProvider.findByID(id, function(err, quizResult){
    if(err){
      self.contentType('text/plain');
      return err;
    }
    self.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: JSON.parse(quizResult)
      }
    });
  })
});

get('/*.css', function(file) {
  this.render(file + '.css.sass', { layout: false });
});

run();

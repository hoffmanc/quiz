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

get('/quiz/new', function(){
  this.render('quiz-show.html.haml', {
    locals: {
      title: 'New Quiz',
      quiz: { 
        name: 'New Quiz', 
        publishOn: (new Date()).toString()
      }
    }
  });
});

post('/quiz/new', function(id) {
  var self = this;
  quizProvider.save({
    name: self.param('name'),
    publishOn: new Date(self.param('publishOn'))
  }, function(err, result){
    if(err) {
      self.contentType('text/plain');
      return err;
    } else {
      self.render('quiz-show.html.haml', {
        locals: {
          title: 'Quiz',
          quiz: result
        }
      });
    }
  }
  );
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
        quiz: quizResult
      }
    });
  })
});

get('/quiz', function() {
  var self = this;
  quizProvider.findByID(id, function(err, quizResult){
    if(err){
      self.contentType('text/plain');
      return err;
    }
    self.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: quizResult
      }
    });
  })
});

get('/*.css', function(file) {
  sys.puts('.sass');
  sys.puts(file + '.sass');
  this.render(file + '.sass', { layout: false });
});

run();

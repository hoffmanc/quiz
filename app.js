var kiwi= require('kiwi');
kiwi.require('express');
kiwi.seed('mongodb-native');
var sys = require('sys');
require('express/plugins');

var QuizProvider= require('./quizprovider-mongodb').QuizProvider;

configure(function(){
  use(MethodOverride);
  use(ContentLength);
  use(Logger);
  set('root', __dirname);
})

var quizProvider= new QuizProvider('localhost', 27017);

//root
get('/', function(){
  var self = this;
  quizProvider.findAll(function(error, quizes){
    self.render('quizes_index.html.haml', {
      locals: {
        title: 'Quiz',
        quizes: quizes
      }
    });
  })
})

//css
get('/*.css', function(file){
  this.render(file + '.css.sass', { layout: false });
});

//quiz
get('/quiz/new', function(){
  this.render('quiz_new.html.haml', {
    locals: {
      title: 'New Quiz'
    }
  });
});

post('/quiz/new', function(){
  var self = this;
  quizProvider.save({
    title: this.param('title'),
    body: this.param('body')
  }, function(error, docs) {
    self.redirect('/')
  });
});

get('/quiz/*', function(id){
  var self = this;
  quizProvider.findById(id, function(error, quiz) {
    if(error){ 
      var a = 'apple';
      debugger;
    } else {
      self.render('quiz_show.html.haml', {
        locals: {
          title: quiz.title,
          quiz: quiz
        }
      });
    }
  });
});

post('/quiz/addComment', function() {
  var self = this;
  quizProvider.addCommentToArticle(this.param('_id'), {
    person: self.param('person'),
    comment: self.param('comment'),
    created_at: new Date()
  }, function(error, docs) {
    self.redirect('/quiz/' + self.param('_id'))
  });
});

run();

var kiwi= require('kiwi')
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

get('/quiz/*', function() {
    var self = this;
    quizProvider.findByID(1, function(err, quizResult){
        self.render('quiz-show.html.haml', {
            locals: {
                title: 'Latest Quiz',
                quiz: quizResult
            }
        });
    })
});

get('/*.css', function(file) {
    this.render(file + '.css.sass', { layout: false });
});

run();

var kiwi = require('kiwi'),
    sys = require('sys');
kiwi.seed('mongodb-native');

var app = require('express').createServer(),
  quizProvider = require('./quizprovider-mongodb').newQuizProvider();

//app.configure(function(){
  //app.use((MethodOverride);
  //use(ContentLength);
  //use(Logger);
  //set('root', __dirname);
//})

app.get('/', function(req, res, params) {
  quizProvider.findLatest(function(err, quizResult){
    res.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: quizResult
      }
    });
  })
});

app.get('/quiz/new', function(req, res, params){
  res.render('quiz-edit.html.haml', {
    locals: {
      title: 'New Quiz',
      quiz: { 
        name: 'New Quiz', 
        publishOn: (new Date()).toString()
      }
    }
  });
});

app.post('/quiz/new', function(req, res, params) {
  quizProvider.save({
    name: req.param('name'),
    publishOn: new Date(req.param('publishOn'))
  }, function(err, result){
    res.render('quiz-show.html.haml', {
      locals: {
        slug: function(str) { return str.toLowerCase().replace(/\s/,"-"); },
        title: 'Quiz',
        quiz: result
      }
    });
  });
});

app.get('/quiz/:id', function(req, res, params) {
  quizProvider.findByName(params.name, function(err, quizResult){
    res.render('quiz-show.html.haml', {
      locals: {
        title: 'Latest Quiz',
        quiz: quizResult
      }
    });
  })
});

app.get(/^\/(\w).css/, function(req, res, params) {
  res.render(params[0] + '.css.sass', { layout: false });
});

app.dynamicHelpers({
  slug: function(req, res, params){
    return params[0].toLowerCase().replace(/\s/,"-");
  }
});

app.listen(3000);

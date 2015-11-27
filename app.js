var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var routes          = require('./routes/index');
var users           = require('./routes/users');
var ejs             = require('ejs');
var app = express();

// view engine setup
// utilisation du moteur de swig pour les .html
//Moteur de template Swig prêt qui se lancera sur les fichiers .html
//app.engine('html', ejs.renderFile); 
//app.engine('.html', ejs.__express);

// utiliser le moteur de template pour les .html
app.set('view engine', 'ejs'); 
// dossier des vues
app.set('views', path.join(__dirname, 'views')); 
// view cache
app.set('view cache', false); // désactivation du cache express
//swig.setDefaults({ cache: false }); // désactivation du cache swig


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/search',maVar);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

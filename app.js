var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var constants = require('./helpers/constants');
var MongoStore = require('connect-mongo')(session);

var dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/test';

var app = express();

console.log("Running in",app.get('env'),"mode");

mongoose.connect(dbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  //success - db is ready
});

var User = require('./db/models/user')(mongoose);
var HistoricalData = require('./db/models/historicaldata')(mongoose);
var Strategy = require('./db/models/strategy')(mongoose);
var Market = require('./db/models/market')(mongoose);
var modelProvider = require('./db/models/modelProvider');

modelProvider.provide('User', User);
modelProvider.provide('HistoricalData', HistoricalData);
modelProvider.provide('Strategy', Strategy);
modelProvider.provide('Market', Market);

//require all routerIndex
var routerIndex = require('./routes/index');
var routerUsers = require('./routes/users');
var routerStrategies = require('./routes/strategies');
var routerHistoricalData = require('./routes/historical_data');

routerUsers.init();
routerStrategies.init();
routerHistoricalData.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


var isEnvDev = app.get('env') === 'development';

if (isEnvDev){
  routerUsers.setOAuthTokens(constants.DEV_CLIENT_ID,
                      constants.DEV_CLIENT_SECRET,
                      app.get('env'),
                      constants.GOOGLE_CLIENT_ID,
                      constants.GOOGLE_CLIENT_SECRET,
                      constants.DEV_GOOGLE_REDIRECT_URI);

}else{
  routerUsers.setOAuthTokens(constants.PROD_CLIENT_ID,
                        constants.PROD_CLIENT_SECRET,
                        app.get('env'),
                        constants.GOOGLE_CLIENT_ID,
                        constants.GOOGLE_CLIENT_SECRET,
                        constants.PROD_GOOGLE_REDIRECT_URI);
}

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'X717197123987123',//TODO change this to a long key
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
}));

//User routes
if(isEnvDev) app.get('/api/user', routerUsers.list_users(User));
app.get('/api/user/:id', routerUsers.find_user(User));
app.get('/api/user/:user_id/strategy', routerStrategies.findUserStrategies());
app.post('/api/user/:user_id/strategy', routerStrategies.createStrategy());
app.delete('/api/user/:user_id', routerUsers.delete_user(User));

//Strategy routes
if(isEnvDev) app.get('/api/strategy', routerStrategies.getAllStrategies());
// app.get('/api/strategy_list/:groupId/routerStrategies/:id', routerStrategies.findStrategy());
app.post('/api/user/:userId/strategy', routerStrategies.createStrategy());
app.put('/api/user/:userId/strategy/:id', routerStrategies.editStrategy());
app.delete('/api/user/:userId/strategy/:id', routerStrategies.deleteStrategy());

//search routerIndex
app.get('/api/search/user/:id', routerStrategies.searchStrategy());

//TODO add historical data routes
//app.get('/api/routerUsers/:user_id/strategy_list', historicaldata.list_groups(HistoricalData,Strategy));
//app.get('/api/routerUsers/:user_id/strategy_list/:id', historicaldata.find_group(HistoricalData,Strategy));
//app.post('/api/routerUsers/:user_id/strategy_list', historicaldata.create_group(HistoricalData,Strategy));
//app.put('/api/routerUsers/:user_id/strategy_list/:id', historicaldata.update_group(HistoricalData,Strategy));
//app.delete('/api/routerUsers/:user_id/strategy_list/:id', historicaldata.delete_group(User, HistoricalData));

//login routerIndex
app.post('/login/', routerUsers.login_user());
app.get('/logout/', routerUsers.logout_user());
app.post('/signup/', routerUsers.signup_user());

app.get('/auth/github/callback', routerUsers.authenticate_github());
app.get('/oauth2callback', routerUsers.authenticate_google());

app.get('/auth/current', routerUsers.get_logged_in_user());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found: ' + req.baseUrl);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);
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
  console.log(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;


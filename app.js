require('dotenv').config(); // new line 1

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts'); // around line 6
var session = require('express-session') // around line 9
var flash = require('express-flash-messages') // around line 10

var passport = require('./services/passport-auth');
var authRouterConfig = require('./routes/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stocksRouter = require('./routes/stocks') // around line 12
var productsRouter = require('./routes/products'); // around line 15

var SESSION_SECRET = process.env.SESSION_SECRET || "super secret" // around line 16 (before app initialization)

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts); // around new line 22

//around line 30 (after cookie parser and express layouts stuff)
app.use(session({
  cookie: { maxAge: 60000},
  secret: SESSION_SECRET,
  name: 'stocks-app-session',
  resave: true,
  saveUninitialized: true
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

// routes
var authRouter = authRouterConfig(passport) // need to pass passport after the initialization step above
app.use('/', authRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stocks', stocksRouter) // around line 29
app.use('/', productsRouter); // around line 43


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

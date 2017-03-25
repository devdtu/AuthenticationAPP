var express = require('express'); 
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//connect to Our Database
mongoose.connect('mongodb:172-31-44-190:~/stack/mongodb');
var db = mongoose.connection;

//include the file we are gonna use for routes
var routes = require('./routes/index');
var users = require('./routes/users');

// Initialize the App
var app = express();

// View Engine
//the line below tells our system that a folder name views will handle our views
app.set('views', path.join(__dirname, 'views'));
//Line below tells that  default layout file will be called 'layout'
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware -- setup and configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder 
// this is gonna be our public folder. Stylesheet(css), images (stuff publically available to browser)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
// taken form https://github.com/ctavan/express-validator  (as it is)
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash Middleware
app.use(flash());

// Some Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 8080));

//start the server
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
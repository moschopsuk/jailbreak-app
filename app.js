var express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    mongoose        = require('mongoose'),
    session         = require('express-session'),
    flash           = require('express-flash'),
    env             = require('node-env-file'),
    app             = express();

//Envronmental
env(__dirname + '/.env');

//Connect to DB
mongoose.connect(process.env.MONGODB);

//Setup passport service
require('./lib/passport')(passport);

app.set('views', __dirname + '/assets/views');
app.set('view engine', 'jade');
app.set('env', process.env.ENV);

//Log requests
app.use(logger('dev'));

//Allow express to read POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Allow express to handle cookies
app.use(cookieParser());

//Auth plugins
app.use(session({ secret: 'jailbreakapp', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Pass user value in global scope
app.use(function(req, res, next){
    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

//Various routes
var auth        = require('./routes/auth')(app, passport),
    admin       = require('./routes/admin'),
    team        = require('./routes/team'),
    user        = require('./routes/user'),
    location    = require('./routes/location');
    index       = require('./routes/index');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/auth/login');
}

//Admin systems
app.use('/admin', isLoggedIn, admin);
app.use('/admin/teams', isLoggedIn, team);
app.use('/admin/users', isLoggedIn, user);
app.use('/admin/locations', isLoggedIn, location);

//Gernic pages
app.use('/', index);

if (app.get('env') === 'dev') {
    app.locals.pretty = true;
}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

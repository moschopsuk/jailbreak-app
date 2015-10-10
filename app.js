var express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    User            = require('./models/user'),
    mongoose        = require('mongoose'),
    env             = require('node-env-file'),
    app             = express();

//Envronmental
env(__dirname + '/.env');

//Various routes
var auth    = require('./routes/auth'),
    admin   = require('./routes/admin');

app.set('views', __dirname + '/assets/views');
app.set('view engine', 'jade');

//Log requests
app.use(logger('dev'));

//Allow express to read POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Allow express to handle cookies
app.use(cookieParser());

//Auth plugins
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Connect to DB
mongoose.connect(process.env.MONGODB);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

//Login systems
app.use('/auth', auth);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/auth/login');
}

//Admin framework
app.use('/admin', isLoggedIn, admin);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

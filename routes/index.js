module.exports = function (express, app, passport) {
    //Various routes
    var auth        = require('./auth')(app, passport),
        home        = require('./home');
        admin       = require('./admin'),
        team        = require('./team'),
        user        = require('./user'),
        location    = require('./location');

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
    app.use('/', home);
};

module.exports = function(app, passport) {
    app.get('/auth/login', function(req, res) {
        res.render('auth/login');
    });

    // process the login form
    app.post('/auth/login', passport.authenticate('local-login', {
        successRedirect : '/admin',
        failureRedirect : '/auth/login',
        failureFlash : true
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/auth/register', function(req, res) {
        res.render('auth/register');
    });

    // process the signup form
    app.post('/auth/register', passport.authenticate('local-signup', {
        successRedirect : '/auth/login',
        failureRedirect : '/auth/register',
        failureFlash : true
    }));

    app.get('/auth/logout', function(req, res) {
        req.logout();
        req.flash('success', 'Logged out successfully.')
        res.redirect('/auth/login');
    });
};

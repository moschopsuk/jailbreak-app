var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport'),
    User        = require('./../models/user');

router.get('/login', function(req, res) {
    res.render('auth/login', { });
});

router.post('/login', passport.authenticate('local', {
    successRedirect : '/admin',
    failureRedirect : '/auth/login'
}));

router.get('/register', function(req, res) {
    res.render('auth/register', { });
});

router.post('/register', passport.authenticate('local', {
    successRedirect : '/admin',
    failureRedirect : '/auth/register'
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
});

module.exports = router;

var express     = require('express');
var router      = express.Router();
var thinky      = require('../lib/thinky');
var Errors      = thinky.Errors;
var User        = require('../models/all').User;

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = User.get(id);

    promise.then(function(user) {
        res.render('admin/users/edit', user);
    }).catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to find user');
        return res.redirect('/admin/users');
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = User.get(id);

    promise.then(function(user) {
        user.email          = req.body.email;
        user.fullName       = req.body.fullName;
        user.isAdmin        = (req.body.isAdmin == "on") ? true : false;
        user.isActivated    = (req.body.isActivated == "on") ? true : false;
        return user.save()
    })
    .then(function(result) {
        req.flash('success', 'Account Updated.');
        res.redirect('/admin/users');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to update details');
        return res.redirect('/admin/users/edit/' + id);
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;
    var promise = User.get(id);

    if(id === req.user.id) {
        req.flash('warnings', 'You can\'t delete yourself!');
        return res.redirect('/admin/users');
    }

    promise.then(function(user) {
        return user.delete();
    })
    .then(function(result) {
        req.flash('success', 'User Deleted');
        res.redirect('/admin/users');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to delete user');
        return res.redirect('/admin/users');
    });
});

router.get('/', function(req, res) {
    User.run().then(function(users) {
        res.render('admin/users/list', {users: users});
    });
});

module.exports = router;

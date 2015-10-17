var express     = require('express'),
    router      = express.Router(),
    User        = require('../models/user');

router.get('/', function(req, res) {
    var page = (req.params.page > 0 ? req.params.page : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    User.list(options, function (err, users) {
        if (err) return res.render('500');

        User.count().exec(function (err, count) {
            res.render('admin/users/list', {
                users: users,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
});


router.get('/edit/:id', function(req, res) {
    var id = req.params.id;

    User.findById(id, function (err, user){
        if(err) {
            req.flash('errors', 'Unable to find user');
            return res.redirect('/admin/users');
        }

        res.render('admin/users/edit', user);
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;

    User.findOneAndUpdate({_id:id}, req.body, function (err, user) {
        if(err) {
            req.flash('errors', 'Unable to update details');
            return res.redirect('/admin/users/edit/' + id);
        }

        req.flash('success', 'Account Updated.');
        res.redirect('/admin/users');
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;

    if(id === req.user.id) {
        req.flash('warnings', 'You can\'t delete yourself!');
        return res.redirect('/admin/users');
    }

    User.remove({ _id: id }, function(err) {
        if (err) {
            req.flash('errors', 'Unable to delete user');
            return res.redirect('/admin/users');
        }

        req.flash('success', 'User Deleted');
        res.redirect('/admin/users');
    });
});


module.exports = router;

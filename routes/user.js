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

module.exports = router;

var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team');

router.get('/:page*?', function(req, res) {
    var page = (req.params.page > 0 ? req.params.page : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    Team.list(options, function (err, teams) {
        if (err) return res.render('500');

        Team.count().exec(function (err, count) {
            res.render('admin/teams/list', {
                teams: teams,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
});

router.get('/new', function(req, res) {
    res.render('admin/teams/new');
});

router.post('/new', function(req, res) {
    var team = new Team(req.body);

    team.save(function(err, team) {
        if(err) {
            req.flash('errors', 'An Error occured creating the team.');
            return res.redirect('/admin/teams/new');
        }

        req.flash('success', 'New team created.');
        res.redirect('/admin/teams');
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;

    Team.findById(id, function (err, user){
        if(err) {
            req.flash('errors', 'Unable to find user');
            return res.redirect('/admin/teams');
        }

        res.render('admin/teams/edit', user);
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;

    Team.findOneAndUpdate({_id:id}, req.body, function (err, user) {
        if(err) {
            req.flash('errors', 'Unable to update details');
            return res.redirect('/admin/teams/edit/' + id);
        }

        req.flash('success', 'Team Updated.');
        res.redirect('/admin/teams');
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;

    Team.remove({ _id: id }, function(err) {
        if (err) {
            req.flash('errors', 'Unable to delete team');
            return res.redirect('/admin/teams');
        }

        req.flash('success', 'Team Deleted');
        res.redirect('/admin/teams');
    });
});

module.exports = router;

var express     = require('express'),
    router      = express.Router(),
    Loc         = require('../models/locations'),
    geo         = require('../lib/distance');

router.get('/', function(req, res) {
    var page = (req.params.page > 0 ? req.params.page : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    Loc.list(options, function (err, locations) {
        if (err) return res.render('500');

        Loc.count().exec(function (err, count) {
            res.render('admin/locations/list', {
                locations: locations,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
});

router.get('/new/:id', function(req, res) {
    var id = req.params.id;

    res.render('admin/locations/new', {_id: id});
});

router.post('/new/:id', function(req, res) {
    var id = req.params.id;

    var loc = new Loc({
        _team    : id,
        place    : req.body.place,
        lat      : req.body.lat,
        lon      : req.body.lon,
        distance : geo.dist(req.body.lat, req.body.lon),
        notes    : req.body.notes,
    });

    loc.save(function (err) {
        if(err) {
            req.flash('errors', 'An Error occured adding the location.');
            return res.redirect('/admin/locations/new/' + id);
        }

        req.flash('success', 'New Location created.');
        res.redirect('/admin/locations');
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;

    Loc.findOne({'_id': id}).populate('_team').exec(function (err, location){
        if(err) {
            req.flash('errors', 'Unable to find location');
            return res.redirect('/admin/locations');
        }

        res.render('admin/locations/edit', location);
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var loc = req.body;
    loc.distance = geo.dist(req.body.lat, req.body.lon);

    Loc.findOneAndUpdate({_id:id}, req.body, function (err, user) {
        if(err) {
            req.flash('errors', 'Unable to update details');
            return res.redirect('/admin/locations/edit/' + id);
        }

        req.flash('success', 'Location Updated.');
        res.redirect('/admin/locations');
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;

    Loc.remove({ _id: id }, function(err) {
        if (err) {
            req.flash('errors', 'Unable to delete location');
            return res.redirect('/admin/locations');
        }

        req.flash('success', 'Location Deleted');
        res.redirect('/admin/locations');
    });
});

module.exports = router;

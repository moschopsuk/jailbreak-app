var express     = require('express'),
    router      = express.Router(),
    Location    = require('../models/locations');

router.get('/', function(req, res) {
    res.render('admin/locations/list');
});

router.get('/new/:id', function(req, res) {
    var id = req.params.id;
    res.render('admin/locations/new', {team: id});
});

router.post('/new/:id', function(req, res) {
    var id = req.params.id;

    var loc = new Location({
        _team   : id,
        place   : req.body.place,
        lat     : req.body.lat,
        lon     : req.body.lon,
        notes   : req.body.notes,
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



module.exports = router;

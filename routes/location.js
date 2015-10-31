var express     = require('express');
var router      = express.Router();
var config      = require(__dirname+'/../config.js');
var thinky      = require('thinky')(config);
var Errors      = thinky.Errors;
var Locations   = require('../models/locations');
var Team        = require('../models/team');
var geo         = require('../lib/distance');

router.get('/new/:id', function(req, res) {
    var teamId = req.params.id;
    var promise = Team.get(teamId);

    promise.then(function(team) {
        res.render('admin/locations/new', {teamId: teamId});
    }).catch(Errors.DocumentNotFound, function(err) {
        req.flash('warnings', 'Uknown team');
        return res.redirect('/admin/locations');
    });
});

router.post('/new/:id', function(req, res) {
    var teamId = req.params.id;
    var promise = Team.get(teamId);

    promise.then(function(team) {
        var location = new Locations({
            teamId      : team,
            place       : req.body.place,
            lat         : req.body.lat,
            lon         : req.body.lon,
            distance    : geo.dist(req.body.lat, req.body.lon),
            notes       : req.body.notes,
            timestamp   : req.body.timestamp,
        });

        return location.save();
    }).then(function(result){
        req.flash('success', 'New location added to team.');
        res.redirect('/admin/locations');
    }).catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'An Error occured adding the location.');
        res.redirect('/admin/locations/new/' + teamId);
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = Locations.get(id);

    promise.then(function(location) {
        res.render('admin/locations/edit', location);
    })
    .then(function(result) {
        req.flash('success', 'Location Updated');
        res.redirect('/admin/locations');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to find location');
        res.redirect('/admin/locations');
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = Locations.get(id);

    promise.then(function(location) {
        location.place      = req.body.place;
        location.lat        = req.body.lat;
        location.lon        = req.body.lon;
        location.distance   = geo.dist(req.body.lat, req.body.lon);
        location.notes      = req.body.notes;
        location.timestamp  = req.body.timestamp;

        return location.save();
    })
    .then(function(result) {
        req.flash('success', 'Location Updated');
        res.redirect('/admin/locations');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to find location');
        return res.redirect('/admin/locations');
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;
    var promise = Locations.get(id);

    promise.then(function(location) {
        return location.delete();
    })
    .then(function(result) {
        req.flash('success', 'Location Deleted');
        res.redirect('/admin/locations');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to delete location');
        return res.redirect('/admin/locations');
    });
});

router.get('/', function(req, res) {
    Locations.getJoin({team: true}).run().then(function(locations) {
        res.render('admin/locations/list', {locations: locations});
    });
});

module.exports = router;

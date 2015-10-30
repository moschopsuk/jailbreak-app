var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team'),
    Locations   = require('../models/locations');


router.get('/leaderboard', function(req, res) {

    Locations.aggregate([
        {
            $group:{
                _id: "$_id",
                distance: { $max: "$distance"  },
                team: { $first: "$_team" },
                place: { $first: "$place" }
            }
        },
        {
            $sort: { timestamp : -1 }
        }
    ], function (err, grouped) {
        //Team.populate(grouped, { "path": "_id._team" }, function(err, leaderboard) {
            res.json(grouped);
        //});
    });
});

router.get('/teams', function(req, res) {
    var promise = Team.find().lean().exec();

    promise.then(function(teams) {
        res.setHeader('Content-Type', 'application/json');
        res.json(teams);
    });
});

router.get('/recent', function(req, res) {
    var promise = Locations.aggregate([
        {
            $group: {_id: "$_team",
                distance:   { $max: "$distance" },
                timestamp:  { $first: "$timestamp" },
                place:      { $first: "$place" },
                lat:      { $first: "$lat" },
                lon:      { $first: "$lon" }
            }
        },
        {
            $sort: { timestamp : -1 }
        }
    ]).exec();

    promise.then(function(locations) {
        Team.populate(locations, { "path": "_id" }, function(err, leaderboard) {
            res.setHeader('Content-Type', 'application/json');
            res.json(leaderboard);
        });
    });
});

module.exports = router;

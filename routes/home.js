var express    = require('express'),
    router     = express.Router(),
    Team       = require('../models/team'),
    Locations  = require('../models/locations');

router.get('/', function(req, res) {
    var promise = Locations.aggregate([
        {
            $group: {_id: "$_team",
                distance:   { $max: "$distance" },
                timestamp:  { $first: "$timestamp" },
                place:      { $first: "$place" }
            }
        },
        {
            $sort: { distance : -1 }
        }
    ]).exec();

    promise.then(function(locations) {
        Team.populate(locations, { "path": "_id" }, function(err, leaderboard) {
            res.render('index', {leaderboard: leaderboard});
        });
    });
});

module.exports = router;

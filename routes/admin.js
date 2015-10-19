var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team'),
    Loc         = require('../models/locations');

router.get('/', function(req, res) {

    Loc.aggregate([
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
    ], function (err, grouped) {
        Team.populate(grouped, { "path": "_id" }, function(err, leaderboard) {
            res.render('admin/index', {leaderboard: leaderboard});
        });
    });
});

module.exports = router;

var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team'),
    Loc         = require('../models/locations');

router.get('/', function(req, res) {

    var promise = Loc.find({})
        .populate('_team')
        .sort({distance:-1})
        .exec();

    promise.then(function(locations) {
        var distinc = [];
        var leaderboard = [];
        var key = 1;
        var position = 1;

        locations.forEach(function(loc){
            if(distinc[loc._team.id] === undefined){
                distinc[loc._team.id] = true;
                loc.position = position;
                leaderboard.push(loc);
                position += 1;
            }

            key += 1;
        });

        console.log(leaderboard);

        res.render('admin/index', {leaderboard: leaderboard});
    });
});

module.exports = router;

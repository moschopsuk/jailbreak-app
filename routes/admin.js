var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team'),
    Loc         = require('../models/locations');

router.get('/', function(req, res) {
    var leaderboard = {};
    
    res.render('admin/index', {leaderboard: leaderboard});
});

module.exports = router;

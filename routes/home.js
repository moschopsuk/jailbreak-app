var express     = require('express'),
    router      = express.Router(),
    Team        = require('../models/team'),
    Locations   = require('../models/locations'),
    config      = require(__dirname+'/../config.js');
    thinky      = require('thinky')(config);
    r           = thinky.r;

router.get('/', function(req, res) {
    Locations.getJoin({team: true})
    .group('teamId')
    .max('distance')
    .ungroup()
    .orderBy(r.desc('reduction'))
    .run()
    .map(function(doc) {
        return {
            name:       doc.group.name,
            teamId:     doc.group.id,
            place:      doc.reduction.place,
            distance:   doc.reduction.distance,
            timestamp:  doc.reduction.timestamp
        }
    })
    .then(function(leaderboard) {
        res.render('index', {leaderboard: leaderboard});
    });
});

module.exports = router;

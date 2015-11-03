var express     = require('express');
var router      = express.Router();
var thinky      = require('../lib/thinky');
var Team        = require('../models/all').Team;
var Locations   = require('../models/all').Locations;
var r           = thinky.r;

router.get('/', function(req, res) {
    Locations.getJoin({team: true})
    .group('team')
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
        res.render('admin/index', {leaderboard: leaderboard});
    });
});

module.exports = router;

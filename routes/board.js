var express     = require('express'),
    router      = express.Router(),
    thinky      = require('../lib/thinky');
    Team        = require('../models/all').Team,
    Locations   = require('../models/all').Locations,
    r           = thinky.r;

router.get('/control', function(req, res) {
    var total = 0;

    Locations.getJoin({team: true})
    .group('team')
    .max('distance')
    .ungroup()
    .orderBy(r.desc('reduction'))
    .run()
    .map(function(doc) {
        total += doc.reduction.distance;

        return {
            name:       doc.group.name,
            teamId:     doc.group.id,
            place:      doc.reduction.place,
            distance:   doc.reduction.distance,
            timestamp:  doc.reduction.timestamp
        }
    })
    .then(function(leaderboard) {
        res.render('board/control', {leaderboard: leaderboard});
    });
});

router.get('/', function(req, res) {
    res.render('board/index');
});

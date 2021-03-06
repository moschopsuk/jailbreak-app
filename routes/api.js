var express     = require('express'),
    router      = express.Router(),
    thinky      = require('../lib/thinky'),
    Team        = require('../models/all').Team,
    Locations   = require('../models/all').Locations,
    r           = thinky.r;


router.get('/leaderboard', function(req, res) {
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
            picture:    (doc.group.picture) ? doc.group.picture : '',
            place:      doc.reduction.place,
            distance:   doc.reduction.distance,
            timestamp:  doc.reduction.timestamp,
            lat:        doc.reduction.lat,
            lon:        doc.reduction.lon,
        }
    })
    .then(function(leaderboard) {
        res.json(leaderboard);
    });
});

router.get('/team/:id', function(req, res) {
    var teamId = req.params.id;
    var promse = Team.get(teamId);

    promse.then(function(team) {
        var locations = Locations
            .getJoin({team: true})
            .filter({team: team})
            .orderBy(r.desc('timestamp'));

        return [team, locations];
    })
    .spread(function(team, locations) {
        res.json({team: team, locations: locations});
    });
});

module.exports = router;

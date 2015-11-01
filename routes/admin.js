var express     = require('express');
var router      = express.Router();
var Team        = require('../models/team');
var Locations   = require('../models/locations');
var config      = require(__dirname+'/../config.js');
var thinky      = require('thinky')(config);
var r           = thinky.r;

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
        res.render('admin/index', {leaderboard: leaderboard});
    });
});

module.exports = router;

var express     = require('express');
var router      = express.Router();
var config      = require(__dirname+'/../config.js');
var thinky      = require('thinky')(config);
var Errors      = thinky.Errors;
var Team        = require('../models/team');
var easyimg     = require('easyimage');
var Promise     = require('bluebird');
var fs          = Promise.promisifyAll(require('fs'));
var uuid        = require('node-uuid');
var path        = require('path');

router.get('/new', function(req, res) {
    res.render('admin/teams/new');
});

router.post('/new', function(req, res) {
    var team = new Team(req.body);

    team.save().then(function(result) {
        console.log(result);
        req.flash('success', 'New team created.');
        res.redirect('/admin/teams');
    })
    .error(function(error) {
        req.flash('errors', 'An Error occured creating the team.');
        res.redirect('/admin/teams');
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = Team.get(id);

    promise.then(function(team) {
        res.render('admin/teams/edit', team);
    }).catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to find team');
        return res.redirect('/admin/teams');
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var promise = Team.get(id);

    promise.then(function(team) {
        team.name       = req.body.name;
        team.members    = req.body.members;
        team.mobNumber  = req.body.mobNumber;
        team.email      = req.body.email;
        team.notes      = req.body.notes;
        return team.save();
    })
    .then(function(result) {
        req.flash('success', 'Team Updated.');
        res.redirect('/admin/teams');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to update details');
        return res.redirect('/admin/teams/edit/' + id);
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;
    var promise = Team.get(id);

    promise.then(function(team) {
        return team.delete();
    })
    .then(function(result) {
        req.flash('success', 'Team Deleted');
        res.redirect('/admin/teams');
    })
    .catch(Errors.DocumentNotFound, function(err) {
        req.flash('errors', 'Unable to delete team');
        return res.redirect('/admin/teams');
    });
});

router.get('/', function(req, res) {
    Team.run().then(function(teams) {
        res.render('admin/teams/list', {teams: teams});
    });
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

router.post('/picture/:id', function(req, res) {
    var id = req.params.id;
    var image = req.body.image;
    var x1 = req.body.x1;
    var y1 = req.body.y1;
    var w = req.body.w;
    var h = req.body.h;

    var imageBuffer = decodeBase64Image(image);
    var imageUUID = uuid.v4();
    var rawImageFile = path.resolve(__dirname + '/../public/images/teams/raw/' + imageUUID + '.png');
    var imageFile =  path.resolve(__dirname +'/../public/images/teams/' + imageUUID + '.png');

    fs.writeFileAsync(rawImageFile, imageBuffer.data)
    .then(function() {
        return easyimg.crop({
            src:rawImageFile,
            dst:imageFile,
            x: x1,
            y: y1,
            cropwidth: w,
            cropheight: h,
            gravity: 'NorthWest',
        });
    }).then(function() {
        return Team.get(id);
    }).then(function(team) {
        team.picture = imageUUID;
        return team.save();
    }).then(function(result) {
        req.flash('success', 'Picture uploaded!.');
        res.redirect('/admin/teams/edit/' + id);
    });
});


module.exports = router;

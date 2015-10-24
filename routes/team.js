var express     = require('express'),
    router      = express.Router(),
    easyimg     = require('easyimage'),
    Promise     = require('bluebird'),
    fs          = Promise.promisifyAll(require('fs')),
    uuid        = require('node-uuid'),
    path        = require('path'),
    Team        = require('../models/team');

router.get('/new', function(req, res) {
    res.render('admin/teams/new');
});

router.post('/new', function(req, res) {
    var team = new Team(req.body);

    team.save(function(err, team) {
        if(err) {
            req.flash('errors', 'An Error occured creating the team.');
            return res.redirect('/admin/teams/new');
        }

        req.flash('success', 'New team created.');
        res.redirect('/admin/teams');
    });
});

router.get('/edit/:id', function(req, res) {
    var id = req.params.id;

    Team.findById(id, function (err, user){
        if(err) {
            req.flash('errors', 'Unable to find user');
            return res.redirect('/admin/teams');
        }

        res.render('admin/teams/edit', user);
    });
});

router.post('/edit/:id', function(req, res) {
    var id = req.params.id;

    Team.findOneAndUpdate({_id:id}, req.body, function (err, user) {
        if(err) {
            req.flash('errors', 'Unable to update details');
            return res.redirect('/admin/teams/edit/' + id);
        }

        req.flash('success', 'Team Updated.');
        res.redirect('/admin/teams');
    });
});

router.post('/del/:id', function(req, res) {
    var id = req.params.id;

    Team.findById({ _id: id }, function(err, team) {
        if (err) {
            req.flash('errors', 'Unable to delete team');
            return res.redirect('/admin/teams');
        }

        team.remove();

        req.flash('success', 'Team Deleted');
        res.redirect('/admin/teams');
    });
});

router.get('/:page*?', function(req, res) {
    var page = (req.params.page > 0 ? req.params.page : 1) - 1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };

    Team.list(options, function (err, teams) {
        if (err) return res.render('500');

        Team.count().exec(function (err, count) {
            res.render('admin/teams/list', {
                teams: teams,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
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
        Team.findOneAndUpdate({_id:id}, {picture: imageUUID}, function (err, user) {
            if(err) {
                req.flash('errors', 'Unable to upload picture');
                return res.redirect('/admin/teams/edit/' + id);
            }

            req.flash('success', 'Picture uploaded!.');
            res.redirect('/admin/teams/edit/' + id);
        });
    });
});


module.exports = router;

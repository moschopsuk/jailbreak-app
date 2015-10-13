var express     = require('express'),
    router      = express.Router();

router.get('/', function(req, res) {
    res.render('admin/teams/list');
});

router.get('/new', function(req, res) {
    res.render('admin/teams/new');
});

router.post('/new', function(req, res) {
    res.render('index');
});

module.exports = router;

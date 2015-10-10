var express     = require('express'),
    router      = express.Router();

router.get('/', function(req, res) {
    res.render('admin/index');
});

router.get('/test', function(req, res) {
    res.render('admin/index');
});

module.exports = router;

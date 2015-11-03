var thinky      = require('../lib/thinky');
var type        = thinky.type;
var Locations   = require('./locations');

var Team = thinky.createModel("Teams", {
    id:         type.string(),
    name:       type.string(),
    members:    type.string(),
    notes:      type.string(),
    mobNumber:  type.string(),
    email:      type.string(),
    picture:    type.string(),
});

module.exports = Team;

var Locations = require(__dirname+'/locations.js');

Team.hasMany(Locations, 'locations', 'id', 'teamid');

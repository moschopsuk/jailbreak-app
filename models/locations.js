var thinky   = require('../lib/thinky');
var type     = thinky.type;

var Locations = thinky.createModel("Locations", {
    id:         type.string(),
    teamid:     type.string(),
    place:      type.string(),
    lat:        type.number(),
    lon:        type.number(),
    distance:   type.number(),
    notes:      type.string(),
    timestamp:  type.date(),
});

module.exports = Locations;

var Team = require(__dirname+'/team.js');
Locations.belongsTo(Team, "team", "teamid", "id");

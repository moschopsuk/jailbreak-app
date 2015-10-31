var config   = require(__dirname+'/../config.js');
var thinky   = require('thinky')(config);
var type     = thinky.type;
var Team     = require('./team');

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

Locations.belongsTo(Team, "team", "team", "id");

module.exports = Locations;

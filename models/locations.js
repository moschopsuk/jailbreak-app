var config   = require(__dirname+'/../config.js');
var thinky   = require('thinky')(config);
var type     = thinky.type;

var Locations = thinky.createModel("Locations", {
    id:         type.string(),
    place:      type.string(),
    lat:        type.number(),
    lon:        type.number(),
    distance:   type.number(),
    notes:      type.string(),
    timestamp:  type.date(),
});

module.exports = Locations;

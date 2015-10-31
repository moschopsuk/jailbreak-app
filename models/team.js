var config    = require(__dirname+'/../config.js');
var thinky    = require('thinky')(config);
var type      = thinky.type;

var Team = thinky.createModel("Teams", {
    id:         type.string(),
    name:       type.string(),
    members:    type.string(),
    notes:      type.string(),
    mobNumber:  type.string(),
    email:      type.string(),
    picture:    type.string(),
});


Team.pre('save', function(next) {
    console.log(this);
    next();
});

module.exports = Team;

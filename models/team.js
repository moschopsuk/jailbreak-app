var mongoose = require('mongoose'),
    Loc      = require('./locations'),
    geo      = require('../lib/distance');
    Schema   = mongoose.Schema;

var TeamSchema = new Schema({
    name        : String,
    members     : String,
    notes       : String,
    mobNumber   : Number,
    email       : String,
    picture     : String,
});

TeamSchema.path('name').required(true, 'Team name cannot be blank');

TeamSchema.statics = {
    list: function (options, cb) {
      var criteria = options.criteria || {}

      this.find(criteria)
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb);
    }
}

TeamSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    var lat = process.env.LAT;
    var lon = process.env.LON;

    var loc = new Loc({
        _team    : this._id,
        place    : 'Lancaster University, Bailrigg, United Kingdom',
        lat      : lat,
        lon      : lon,
        distance : geo.dist(lat, lon),
        notes    : 'Automatically Added by the system as a starting point.',
    });

    loc.save(function (err) {
        next();
    });
});

TeamSchema.methods.locations = function (done) {
    return Loc.find({_team: this._id}, done);
};

module.exports = mongoose.model('Team', TeamSchema);

var mongoose    = require('mongoose'),
    Team        = require('./team'),
    geolib      = require('geolib'),
    Schema      = mongoose.Schema;

var LocationSchema = new Schema({
    _team       : { type: Schema.ObjectId, ref: 'Team' },
    place       : String,
    lat         : Number,
    lon         : Number,
    distance    : Number,
    notes       : String,
    timestamp   : { type: Date, default: Date.now }
});

LocationSchema.statics = {
    list: function (options, cb) {
      var criteria = options.criteria || {}

      this.find(criteria)
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .populate('_team')
        .sort({ timestamp : -1 })
        .exec(cb);
    }
}

module.exports = mongoose.model('Location', LocationSchema);

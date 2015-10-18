var mongoose = require('mongoose'),
    Loc = require('./locations'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name        : String,
    members     : String,
    notes       : String,
    mobNumber   : Number,
    email       : String
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

TeamSchema.methods.locations = function (done) {
    return Loc.find({_team: this._id}, done);
};

module.exports = mongoose.model('Team', TeamSchema);

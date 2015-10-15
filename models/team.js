var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
     _id        : { type: Number, index: true },
    name        : String,
    locations   : [{ type: Schema.Types.ObjectId, ref: 'Location' }]
});

TeamSchema.statics = {

    list: function (options, cb) {
      var criteria = options.criteria || {}

      this.find(criteria)
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb);
    }
}

module.exports = mongoose.model('Team', TeamSchema);

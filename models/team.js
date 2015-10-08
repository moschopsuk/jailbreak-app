var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
     _id        : { type: Number, index: true },
    name        : String,
    locations   : [{ type: Schema.Types.ObjectId, ref: 'Location' }]
});

module.exports = mongoose.model('Team', TeamSchema);

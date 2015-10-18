var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocationSchema = new Schema({
    _team       : { type: Schema.ObjectId, ref: 'Team' },
    place       : String,
    lat         : Number,
    lon         : Number,
    notes       : String,
    timestamp   : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);

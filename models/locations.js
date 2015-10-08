var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name        : String,
    lat         : Number,
    lon         : Number,
    timestamp   : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);

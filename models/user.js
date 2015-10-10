var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    bcrypt                  = require('bcrypt'),
    passportLocalMongoose   = require('passport-local-mongoose');

var UserSchema = new Schema({
    username: { type: String, index: { unique: true } },
    password: { type: String, }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

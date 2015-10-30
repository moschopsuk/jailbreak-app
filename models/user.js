var config   = require(__dirname+'/../config.js');
var thinky   = require('thinky')(config);
var type     = thinky.type;
var bcrypt   = require('bcrypt-nodejs');

var User = thinky.createModel("User", {
    id:             type.string(),
    email:          type.string(),
    fullName:       type.string(),
    password:       type.string(),
    isAdmin:        type.boolean(),
    lastLogin:      type.date(),
});

User.defineStatic("generateHash", function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
});

User.define("validPassword", function(password) {
    return bcrypt.compareSync(password, this.password);
});

module.exports = User;

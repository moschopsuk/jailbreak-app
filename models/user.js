var mongoose                = require('mongoose'),
    bcrypt                  = require('bcrypt-nodejs'),
    Schema                  = mongoose.Schema;

var UserSchema = new Schema({
    email:          { type: String,  },
    fullName:       { type: String,  },
    password:       { type: String,  },
    isAdmin:        { type: Boolean,    default: false    },
    lastLogin:      { type: Date,       default: Date.now }
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.statics = {
    list: function (options, cb) {
      var criteria = options.criteria || {}

      this.find(criteria)
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb);
    }
}

module.exports = mongoose.model('User', UserSchema);

var LocalStrategy   = require('passport-local').Strategy;
var config          = require(__dirname+'/../config.js');
var thinky          = require('thinky')(config);
var Errors          = thinky.Errors;
var User            = require('../models/user');

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.get(id).run().then(function(user, err) {
            done(false, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.filter({email: email}).run().then(function(user) {
                var user = user[0];

                if (!user) {
                    return done(null, false, req.flash('errors', 'Email not found.'));
                }

                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('errors', 'Oops! Wrong password.'));
                } else {
                    user.lastLogin = new Date();
                    user.save().then(function(result) {
                        return done(null, user, req.flash('success', 'Logged in successfully.'));
                    });
                }

            }).error(function(error) {
                return done(null, false, req.flash('errors', 'Error logging in.'));
            });
        });
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {

                User.filter({email: email}).run().then(function(user) {

                    if (user.length > 0) {
                        return done(null, false, req.flash('errors', 'That email is already taken.'));
                    }

                    if(req.body.confirm !== password) {
                        return done(null, false, req.flash('errors', 'Your passwords do not match.'));
                    }

                    var user = new User({
                        email:      email,
                        fullName:   req.body.fullName,
                        lastLogin:  new Date(),
                        password:   User.generateHash(password)
                    });

                    user.save().then(function(result) {
                        return done(null, user, req.flash('warnings', 'Account created, an admin will activate it shortly.'));
                    }).error(function(error) {
                        return done(null, false, req.flash('errors', 'Something odd occured.'));
                    });

                }).error(function(error) {
                    return done(null, false, req.flash('errors', 'Something odd occured.'));
                });
            }
        });
    }));

                /*
                User.findOne({ 'email' :  email }, function(err, user) {
                     if there are any errors, return the error
                    if (err)
                        return done(err);

                    //Check if the passwords match
                    if(req.body.confirm !== password)
                        return done(null, false, req.flash('errors', 'Your passwords do not match.'));

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('errors', 'That email is already taken.'));
                    } else {
                        // create the user
                        var newUser          = new User();

                        newUser.email        = email;
                        newUser.fullName     = req.body.fullName;
                        newUser.lastLogin    = new Date();
                        newUser.password     = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(null, false, req.flash('errors', 'An unknown error occured.'));

                            return done(null, user, req.flash('warnings', 'Account created, an admin will activate it shortly.'));
                        });
                    }
                //});
            //}
        });

    }));*/
};

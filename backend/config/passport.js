const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User'); // Correct import using mongoose.model

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://densefusion.vercel.app/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
            return done(null, existingUser);
        }
        new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value
        }).save().then(user => done(null, user));
    });
}));

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const userModel = require('../models/userModel');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await userModel.findById(jwtPayload.id);
      
      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await userModel.findByEmail(profile.emails[0].value);
        
        if (user) {
          // User exists, update auth provider information if needed
          if (user.auth_provider !== 'google') {
            user = await userModel.updateAuthProvider(
              user.id,
              'google',
              profile.id
            );
          }
        } else {
          // Create new user
          const newUser = {
            username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
            auth_provider: 'google',
            auth_provider_id: profile.id,
            profile_picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            is_verified: true
          };
          
          user = await userModel.create(newUser);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'email', 'name', 'picture'],
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Facebook doesn't always provide email, handle this case
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@facebook.com`;
        
        // Check if user already exists
        let user = await userModel.findByEmail(email);
        
        if (user) {
          // User exists, update auth provider information if needed
          if (user.auth_provider !== 'facebook') {
            user = await userModel.updateAuthProvider(
              user.id,
              'facebook',
              profile.id
            );
          }
        } else {
          // Create new user
          const newUser = {
            username: `fb_${profile.id}`,
            email: email,
            auth_provider: 'facebook',
            auth_provider_id: profile.id,
            profile_picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            is_verified: true
          };
          
          user = await userModel.create(newUser);
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
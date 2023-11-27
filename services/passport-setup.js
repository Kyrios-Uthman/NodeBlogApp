import passport from "passport";
import Strategy from "passport-google-oauth2";
import "dotenv/config";
var GoogleStrategy = Strategy.Strategy;

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: "30517947878-grt4f3gs3h91mbdv8pnceupcil3tdrv6.apps.googleusercontent.com",
      clientSecret:"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",
      callbackURL: "http://localhost:5000/google/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);

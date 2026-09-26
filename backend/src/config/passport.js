const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const prisma = require("../prisma/prismaClient");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const avatar = profile.photos[0]?.value;

        let institution = await prisma.institution.findUnique({
          where: { googleId },
        });

        if (!institution) {
          institution = await prisma.institution.findUnique({
            where: { email },
          });

          if (institution) {
            institution = await prisma.institution.update({
              where: { email },
              data: { googleId, avatar, isVerified: true },
            });
          } else {
            institution = await prisma.institution.create({
              data: { name, email, googleId, avatar, isVerified: true },
            });
          }
        }

        return done(null, institution);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const institution = await prisma.institution.findUnique({ where: { id } });
    done(null, institution);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

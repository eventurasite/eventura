import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import prisma from '../../prisma/client';

// Tipagem explícita para o callback do Passport
type VerifyCallback = (error: any, user?: any) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error('No email'));

        // Verifica se o usuário já existe
        let usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
          // Cria novo usuário com tipo "comum"
          usuario = await prisma.usuario.create({
            data: {
              nome: profile.displayName,
              email,
              senha: '',      
              tipo: 'comum',
              telefone: '',    
            },
          });
        }

        done(null, usuario);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;

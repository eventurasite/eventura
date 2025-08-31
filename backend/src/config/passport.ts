import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        let user = await prisma.usuario.findUnique({
          where: { email: profile.emails?.[0].value || "" },
        });

        if (!user) {
          user = await prisma.usuario.create({
            data: {
              nome: profile.displayName || "Usuário Google",
              email: profile.emails?.[0].value || "",
              senha: null,
              authProvider: "google",
              telefone: "",
              descricao: "",
              url_foto_perfil: profile.photos?.[0].value || "",
              tipo: "comum",
            },
          });
        }

        const token = generateToken({ id: user.id_usuario, email: user.email });

        return done(null, { user, token });
      } catch (err) {
        console.error("Erro no GoogleStrategy:", err);
        return done(err, false);
      }
    }
  )
);

export default passport;

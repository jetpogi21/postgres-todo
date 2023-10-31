import sequelize from "@/config/db";
import SequelizeAdapter from "@auth/sequelize-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import loginSchema from "@/schema/login";
import { User } from "@/models/UserModel";
import { compare, hash } from "bcryptjs";
import { Op } from "sequelize";
import { nanoid } from "nanoid";
import { VerificationToken } from "@/models/VerificationTokenModel";
import { passwordTokenSchema } from "@/schema/password-token";
import { PasswordToken } from "@/models/PasswordTokenModel";

const adapter = SequelizeAdapter(sequelize, { synchronize: false }) as Adapter;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "token",
      name: "Token",
      type: "credentials",
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Invalid call.");
        }

        const { token } = credentials;

        if (!token) {
          throw new Error("Invalid call.");
        }

        //Start the transaction
        const transaction = await sequelize.transaction();

        try {
          //Find the token in the database
          const verificationToken = await VerificationToken.findOne({
            where: { token },
          });

          // If the token exists and is not expired
          if (
            verificationToken &&
            verificationToken.expires.getTime() > Date.now()
          ) {
            // Get the related user
            const user = await User.findByPk(verificationToken.userId);

            if (!user) {
              throw new Error("User not found.");
            }

            user.update({ status: "active" });

            // Delete the token from the database
            //await verificationToken.destroy();
            await transaction.commit();

            return user.toJSON();
          } else {
            throw new Error("Invalid or expired token.");
          }
        } catch (err: any) {
          await transaction.rollback();
          throw new Error(err.message);
        }
      },
      credentials: {
        token: { label: "Token" },
      },
    }),
    CredentialsProvider({
      id: "passwordToken",
      name: "Password Token",
      type: "credentials",
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Invalid call.");
        }

        // Validate user input using Yup schema
        try {
          //Password confirmation matching will happen here
          await passwordTokenSchema.validate(credentials);
        } catch (error: any) {
          throw new Error(error.message);
        }

        const { token, password, email } = credentials;

        //Start the transaction
        const transaction = await sequelize.transaction();

        try {
          // Check if the verification code exists and get the associated email
          const tokenExists = await PasswordToken.findOne({
            where: {
              email,
              token,
              expires: {
                [Op.gte]: Date.now(),
              },
            },
          });

          if (!tokenExists) {
            throw new Error("Invalid verification code");
          }

          // Hash the password using bcryptjs
          const hashedPassword = await hash(password!, 10);

          //Fetch the user
          const user = await User.findOne({
            where: { email, status: "active" },
          });

          if (!user) {
            throw new Error("User not found");
          }

          user.password = hashedPassword;
          await user.save({ transaction });

          await tokenExists.destroy({ transaction });

          await transaction.commit();

          return user.toJSON();
        } catch (err: any) {
          await transaction.rollback();
          throw new Error(err.message);
        }
      },
      credentials: {
        email: { label: "Email" },
        token: { label: "Token" },
        password: { label: "Password" },
        passwordConfirmation: { label: "Password Confirmation" },
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Invalid call.");
        }

        try {
          await loginSchema.validate(credentials);
        } catch (error: any) {
          throw new Error(error.message);
        }

        const { emailOrUsername, password } = credentials;

        const user = await User.findOne({
          where: {
            [Op.or]: [{ email: emailOrUsername }, { name: emailOrUsername }],
          },
        });

        if (!user) {
          throw new Error("Invalid email/username or password.");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid email/username or password.");
        }

        return user.toJSON();
      },
      credentials: {
        emailOrUsername: { label: "Username or Email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await User.findOne({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await User.update(
          {
            username: nanoid(10),
          },
          {
            where: {
              id: dbUser.id,
            },
          }
        );
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
  },
  adapter,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: "/login",
  },
};

export const getAuthSession = () => getServerSession(authOptions);

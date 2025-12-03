import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import User from "./models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error("No user found with this email");
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error("Invalid password");
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.role === 'organizer' 
            ? user.organizerProfile?.fullName 
            : `${user.userProfile?.firstName} ${user.userProfile?.lastName}`,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import { connection } from "@/utils/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      Credential: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connection();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_SECRET,
  pages: {
    signIn: "/",
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

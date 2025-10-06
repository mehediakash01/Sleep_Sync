import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Check if credentials exist
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const { username, password } = credentials;

        // ✅ Dummy user check (replace later with DB logic)
        if (username === "akash" && password === "1234") {
          return {
            id: "1", // must be string
            name: "Akash",
            email: "akash@example.com",
          };
        }

        // ❌ If no valid user found
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // ✅ your custom login page
  },
  session: {
    strategy: "jwt", // recommended for credentials provider
  },
  secret: process.env.NEXTAUTH_SECRET, // add this to .env.local
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

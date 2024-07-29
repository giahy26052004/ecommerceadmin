
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

const addminEmail = ["giahy2605@gmail.com"];
const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      // if (addminEmail.includes(session?.user?.email)) return session;
      // else return false;
      return session;
    },
  },
  debug: true,
};
export default NextAuth(authOptions);
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!addminEmail.includes(session?.user?.email)) {
    res.json(401);
    res.end();
    throw "not admin";
  }
}

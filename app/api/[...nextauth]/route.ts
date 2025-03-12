import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

// This is a simple in-memory user store for demo purposes
// In a real app, you would use a database
export const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    // Password: "password"
    password: "$2b$10$8r0S/CJ7U2xXXXXXXXXXXuBK8c3L6PcS2TV.7XKdlHFfnwXXXXXXXX",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find((user) => user.email === credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || ""
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }


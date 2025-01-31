import CredentialsProvider from "next-auth/providers/credentials";
import { getNewAccessToken } from "../../services/getNewAccessToken";
import { jwtHelpers } from "../../services/jwtHelpers";

const apiUrl = process.env.NODE_ENV === 'production' ? 'http://localhost:6660/api/v1/auth/login' : 'http://localhost:6660/api/v1/auth/login';


export const authOptions: any = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "task-byte",
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Your email....." },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                  const res = await fetch(apiUrl, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                  });
               
                  // Check if response is not ok (e.g., status 400, 401)
                  if (!res.ok) {
                    const errorData = await res.json();
                 
                    throw new Error(errorData?.message );
                  }
              
                  const data = await res.json();
                  const verifiedToken: any = jwtHelpers.verifyToken(
                    data?.token,
                    process.env.JWT_SECRET!
                  );
              
                  if (data && verifiedToken) {
                    return {
                      ...data,
                      ...verifiedToken,
                    };
                  }
                } catch (error: any) {
                  throw new Error(error.message);
                }
              }
              
        })
    ],
    callbacks: {
        async jwt({ token, user }:any) {
          
            return {
                ...token,
                ...user
            }
        },
        async session({ session, token }: {
            session: any,
            token: any
        }) {
          
            const verifiedToken = jwtHelpers.verifyToken(token?.token, process.env.JWT_SECRET!)
            if (!verifiedToken) {
               
                const { data } = await getNewAccessToken(token?.token)
                token.token = data?.token
            }
            return {
                ...session,
                ...token
            }
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/"
    }
}
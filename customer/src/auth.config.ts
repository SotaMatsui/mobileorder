import { User } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';

const publicRoutes = ['/'];
const authRoutes = ['/login', '/register', '/api/auth/signin'];
const DEFAULT_LOGIN_REDIRECT = '/order';

export const authConfig = {
  debug: true,
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/auth-failed',
  },  //  By default, the `id` property does not exist on `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as User['id']
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

      console.log('='.repeat(64));
      console.log(`Current path: ${nextUrl.pathname}`);

      /**
       * すでにログイン済みの場合、認証ルートにアクセスしようとしたらリダイレクトする
       * ログイン処理直後にオーダーページにリダイレクトする処理はsignIn()を呼ぶタイミングで別途設定
       * （DOMだけ書き換えられてURLとその他ロジックが呼ばれない？という意図しない挙動のため）
       */
      if (isAuthRoute) {
        if (isLoggedIn) {
          console.log(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return true;
      }

      if (!isPublicRoute && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { authConfig } from "@/auth.config"
import { signInSchema } from "./libs/zod/schemas";
import { getUserByEmail } from "./libs/db/user";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/libs/db/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  /*
  * PrismaAdapterを設定するとセッションの保存に失敗するのでコメントアウト
  * OIDCの実装は必須要件ではないので、あとで原因を調査
  * p.session.findUniqueがこけているらしい
  * ここら辺のスキーマを調整？
  * ↓
  * Prismaがエッジ環境に対応していないのでJWTのみにするしかないらしい
  */
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    Credentials({
      /*
      * `/api/auth/login`で表示されるビルトイン画面のInputフィールドの設定
      */
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "you@examplea.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      /*
      * `signIn`メソッドを読んだ時に走る関数
      * DBからユーザーを取得し、パスワードを照合する
      * 照合に成功した場合はユーザー情報を返す
      * 失敗した場合はnullを返す
      */
      authorize: async (credentials) => {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          console.log("User found:", user);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("Password match:", passwordMatch);
          if (passwordMatch) return user;

        }

        return null;
      },
    }),
    Google,
  ],
})
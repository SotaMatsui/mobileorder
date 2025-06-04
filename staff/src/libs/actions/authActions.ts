'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { createStaffByEmail, getStaffByEmail } from '@/libs/db/user';
import { signInSchema, signUpSchema } from '@/libs/zod/schemas';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    // フォームデータ取得→バリデーション
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    if (!validatedFields.success) return "バリデーションに失敗しました";
    const { email, password } = validatedFields.data;

    // ログイン試行
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      redirectTo: "/dashboard",
      /** ↑リダイレクトについて:
       * authConfigの方で、ログイン済みならリダイレクトする設定があるものの、
       * 意図した挙動にならなかったので指定
       * （DOMだけ書き換えられてURLとその他ロジックが呼ばれない）
       */
    })
  } catch (error) {

    // リダイレクト
    /**
     * Next.jsの`redirect()`は、エラーを用いて実装されているらしい
     * 参考：
     * https://github.com/nextauthjs/next-auth/discussions/9389#discussioncomment-9034716
     * https://nextjs.org/docs/app/api-reference/functions/redirect#example
     */
    if (isRedirectError(error)) throw error;

    // エラー処理
    if (error instanceof AuthError) {
      return "メールアドレスまたはパスワードが正しくありません";
    }
    return "予期しないエラー: " + error;
  }
}

export async function register(prevState: string | undefined, formData: FormData) {
  try {
    // フォームデータ取得→バリデーション
    const validatedFields = signUpSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    if (!validatedFields.success) return "バリデーションに失敗しました";
    const { email, password } = validatedFields.data;


    // メルアドの重複チェック
    const existingUser = await getStaffByEmail(email);
    if (existingUser) {
      return "このアカウントは既に存在します";
    }

    // DBに書き込んでログイン
    const hashedPassword = await bcrypt.hash(password, 10);
    await createStaffByEmail(email, hashedPassword)
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      redirectTo: "/dashboard",
      /** ↑リダイレクトについて:
       * authConfigの方で、ログイン済みならリダイレクトする設定があるものの、
       * 意図した挙動にならなかったので指定
       * （DOMだけ書き換えられてURLとその他ロジックが呼ばれない）
       */
    })
  } catch (error) {

    // リダイレクト
    /**
     * Next.jsの`redirect()`は、エラーを用いて実装されているらしい
     * 参考：
     * https://github.com/nextauthjs/next-auth/discussions/9389#discussioncomment-9034716
     * https://nextjs.org/docs/app/api-reference/functions/redirect#example
     */
    if (isRedirectError(error)) throw error;

    // エラー処理
    if (error instanceof AuthError) {
      return "認証エラー: " + error.type;
    }
    return "予期しないエラー: " + error;
  }
}

export async function logout() {
  try {
    await signOut();
    redirect('/');
  } catch (error) {
    throw error;
  }
}

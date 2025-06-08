'use client';
import { Button } from "@/components/ui/button";
import { register } from "@/libs/actions/authActions";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterPage() {
  const [message, action, isPending] = useActionState(register, undefined);

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-2xl font-medium">ユーザー登録</h1>
      <form action={action} className="flex flex-col gap-4 p-4  border border-foreground/10 rounded-lg">
        {message != undefined ? <p className="bg-red-700 text-white px-4 py-2 rounded">{message}</p> : null}
        <label htmlFor="email">
          メールアドレス
        </label>
        <input name="email" id="email" type="email" autoComplete="email" className="bg-background border border-foreground/10 px-4 py-2 rounded" />
        <label htmlFor="password">
          パスワード
        </label>
        <input name="password" id="password" type="password" autoComplete="new-password" className="bg-background border border-foreground/10 px-4 py-2 rounded" />
        <button type="submit" value="Sign In" className="bg-black text-white px-4 py-2 rounded">
          {isPending ? '登録しています...' : '登録'}
        </button>
      </form>
      <Link href='/login'><Button variant='link' className="px-0">ログイン</Button></Link>
    </div>
  )
}
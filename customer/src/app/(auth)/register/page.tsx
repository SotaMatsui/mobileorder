'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/libs/actions/authActions";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [message, action, isPending] = useActionState(register, undefined);

  return (
    <div className="flex flex-col items-start justify-center gap-4 h-screen px-4">
      <h1 className="text-2xl font-medium">新規登録</h1>
      <form action={action} className="flex flex-col gap-4 py-4 w-full">
        {message != undefined ? <p className="bg-red-700 text-white px-4 py-2 rounded">{message}</p> : null}
        <Label htmlFor="email">
          メールアドレス
        </Label>
        <Input name="email" id="email" type="email" autoComplete="email" />
        <Label htmlFor="password">
          パスワード
        </Label>
        <Input name="password" id="password" type="password" autoComplete="new-password" />
        <Button type="submit" value="Sign In" disabled={isPending} className="w-full">
          {isPending ?
            <><Loader2 className="animaïïte-spin" />登録しています...</>
            : 'ユーザー登録'}
        </Button>
        <Button type="button" variant='secondary' onClick={() => signIn("google")}>Googleでログイン</Button>
      </form>
      <Link href='/login'>
        <Button variant='link' className="px-0">ご登録済みですか？ログインはこちら</Button>
      </Link>
    </div>
  )
}
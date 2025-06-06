'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/libs/actions/authActions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [message, action, isPending] = useActionState(login, undefined);

  return (
    <div className="flex flex-col items-start justify-center gap-4 h-screen px-4">
      <h1 className="text-2xl font-medium">ログイン</h1>
      <form action={action} className="flex flex-col gap-4 py-4 w-full">
        {message != undefined ? <p className="bg-red-700 text-white px-4 py-2 rounded">{message}</p> : null}
        <Label htmlFor="email">
          メールアドレス
        </Label>
        <Input name="email" id="email" type="email" autoComplete="email" />
        <Label htmlFor="password">
          パスワード
        </Label>
        <Input name="password" id="password" type="password" autoComplete="current-password" />
        <Button type="submit" value="Sign In" disabled={isPending} className="w-full">
          {isPending ?
            <><Loader2 className="animate-spin" />ログインしています...</>
            : 'ログイン'}
        </Button>
      </form>
      <Link href='/register'><Button variant='link' className="px-0">ご利用は初めてですか？新規登録はこちら</Button></Link>
    </div>
  )
}
'use client';
import { logout } from "@/libs/actions/authActions";

export function SignOutButton() {
  return (
    <button
      className='bg-foreground/5 text-foreground rounded-lg px-8 py-2 mt-6 hover:bg-foreground/3 focus-visible:outline-offset-2 hover:cursor-pointer'
      onClick={() => { logout(); }}
    >
      ログアウト
    </button>
  )
}
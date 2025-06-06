import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-dvh flex flex-col items-start justify-center gap-2 px-8">
      <p className="text-5xl mb-4">ようこそ</p>
      <Link href='/login'>
        <Button>
          ログイン
        </Button>
      </Link>
      <Link href='/register'>
        <Button variant='secondary'>
          アカウント登録
        </Button>
      </Link>
    </div>
  );
}

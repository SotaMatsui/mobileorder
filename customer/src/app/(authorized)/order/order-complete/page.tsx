import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrderCompletePage() {
  return (
    <div className="w-full h-dvh flex flex-col items-start justify-center gap-2 px-8">
      <p className="text-5xl mb-4">注文が完了しました</p>
      <Link href='/order'>
        <Button>
          <ArrowLeft />メニューに戻る
        </Button>
      </Link>
    </div>
  );
}

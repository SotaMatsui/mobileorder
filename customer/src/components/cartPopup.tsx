'use client';
import { useCartStore } from "@/providers/cart-store-provider";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CartPopup() {
  const { currentCart, totalPrice, addItem, removeItem } = useCartStore((state) => state);
  const [isHidden, setIsHidden] = useState(false);
  const router = useRouter()
  return (
    <div className="fixed z-20 bottom-0 w-full p-2">
      <div className="w-full bg-background drop-shadow-lg rounded-lg px-4 max-h-dvh overflow-y-auto">
        <div className="flex justify-between items-center py-2 sticky top-0 bg-background">
          <Button variant='ghost' onClick={() => setIsHidden(!isHidden)}>
            <p>ご注文リスト</p>
            {isHidden ? <ChevronDownIcon className="size-5" /> : <ChevronUpIcon className="size-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <p className="">計￥{totalPrice.toLocaleString()}</p>
            <Button disabled={currentCart.length === 0} onClick={() => router.push('/checkout')}>
              注文
            </Button>
          </div>
        </div>
        <div className={`transition-[height] duration-300 ${isHidden ? 'h-[50vh]' : 'h-0 overflow-hidden'}`}>
          {currentCart.map((entry) => (
            <div key={entry.menuItemId} className="border-b py-2">
              <p className="text-lg">{entry.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">￥{entry.price.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">数量: {entry.quantity}</p>
                  <Button
                    variant="outline"
                    onClick={() => addItem(entry.menuItem)}
                  >
                    <Plus className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeItem(entry.menuItem)}
                  >
                    <Minus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
'use client';

import { useCartStore } from "@/providers/cart-store-provider";
import { MenuItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ListPlusIcon } from "lucide-react";

export function AddToCartButton({ item, className }: { item: MenuItem, className?: string }) {
  const { addItem } = useCartStore((state) => state);

  return (
    <Button
      className={`dark:bg-background dark:text-foreground ${className}`}
      onClick={() => { addItem(item) }}
    >
      注文リストに追加<ListPlusIcon />
    </Button>
  )
}
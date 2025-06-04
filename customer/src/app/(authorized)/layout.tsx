import { CartStoreProvider } from "@/providers/cart-store-provider";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <CartStoreProvider>{children}</CartStoreProvider>;
}
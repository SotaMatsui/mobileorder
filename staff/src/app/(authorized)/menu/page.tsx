import { MenuItemEditor } from "@/components/menuItemEditor";
import { getMenuItems } from "@/libs/db/menuItem";

export default async function MenuPage() {
  const data = await getMenuItems();
  return (
    <main className='flex min-h-screen flex-col items-center px-4'>
      <h1 className='my-6 text-center text-2xl'>Edit Menu</h1>
      {data != null ?
        <MenuItemEditor initialMenuItems={data} />
        : <p>データの取得に失敗しました</p>
      }
    </main>
  );
}

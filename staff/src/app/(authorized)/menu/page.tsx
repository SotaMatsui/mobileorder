import { MenuItemEditor } from "@/components/menuItemEditor";
import TitleBar from "@/components/titlebar";
import { getMenuItems } from "@/libs/db/menuItem";

export default async function MenuPage() {
  const data = await getMenuItems();
  return (
    <div className="min-h-screen">
      <TitleBar title="メニュー編集" />
      <main className='flex min-h-screen flex-col items-center px-4'>
        {data != null ?
          <MenuItemEditor initialMenuItems={data} />
          : <p>データの取得に失敗しました</p>
        }
      </main>
    </div>
  );
}

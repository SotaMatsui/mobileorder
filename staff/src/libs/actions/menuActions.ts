'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';
import { MenuItemEditorEntry } from '@/components/menuItemEditor';

async function _upsertOrDeleteMenuItems(
  itemsToCreate: Prisma.MenuItemCreateManyInput[],
  itemsToUpdate: Prisma.MenuItemUpdateInput[],
  itemsToDelete: string[],
) {
  try {
    console.log("Updating menu items...");
    console.log("Items to create:", itemsToCreate);
    console.log("Items to update:", itemsToUpdate);
    console.log("Items to delete:", itemsToDelete);

    // メニューアイテムの更新
    await prisma.menuItem.createMany({
      data: itemsToCreate
    });
    await prisma.$transaction(itemsToUpdate.map((data) =>
      prisma.menuItem.update({ data, where: { id: data.id as string } })
    ));
    await prisma.menuItem.deleteMany({
      where: {
        id: {
          in: itemsToDelete,
        },
      },
    });

  }
  catch (error) {
    console.error("Error updating menu item:", error);
    return "エラー: " + error;
  }
}

/// image削除 → MenuItem仕分け → PrismaからDBを更新
export async function updateMenu(menuItems: MenuItemEditorEntry[]) {
  const itemsToCreate: Prisma.MenuItemCreateManyInput[] = [];
  const itemsToUpdate: Prisma.MenuItemUpdateInput[] = [];
  const itemsToDelete: string[] = []; for (let i = 0; i < menuItems.length; i++) {
    // Prisaの入力型に合わせて、imageフィールドを削除
    delete menuItems[i].image
    const createItem = menuItems[i] as Prisma.MenuItemCreateInput;

    // menuItemをupdateかcreateに仕分け
    if (createItem.createdAt === undefined) {
      itemsToCreate.push(createItem);
    } else {
      itemsToUpdate.push(createItem as Prisma.MenuItemUpdateInput);
    }
  };
  // db更新
  await _upsertOrDeleteMenuItems(itemsToCreate, itemsToUpdate, itemsToDelete);
}


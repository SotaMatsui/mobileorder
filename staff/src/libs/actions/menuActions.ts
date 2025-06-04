'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';
import { supabase } from '@/libs/db/supabase';
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

async function _uploadImage(
  menuItemId: string,
  file: File
) {
  try {
    if (!file) throw new Error('No file selected for upload')

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(`public/${menuItemId}`, file, { upsert: true })

    if (error) throw error

    if (data) {
      console.log('File uploaded successfully:', data.path)
    }
  } catch (e) {
    console.error('Error uploading file:', e)
    throw e
  }
}

/// image削除 → MenuItem仕分け → PrismaからDBを更新
async function updateRDB(menuItems: MenuItemEditorEntry[]) {
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


export async function updateMenu(menuItems: MenuItemEditorEntry[]) {
  type ImageUpload = {
    menuItemId: string,
    image: File,
    index: number
  };
  const imagesToUpload: ImageUpload[] = [];

  try {
    // 1. アップロードする画像の仕分け
    for (let i = 0; i < menuItems.length; i++) {
      const entry = menuItems[i];

      // 画像がある場合はアップロード対象に追加
      if (entry.image != undefined) {
        // 画像のサイズチェック（5MB以下）
        if (entry.image!.size > 5 * 1024 * 1024 /* 5MB */) {
          throw new Error(`${entry.name}の画像アップロードをスキップしました。画像のサイズが大きすぎます。5MB以下の画像を選択してください。`);
        }
        imagesToUpload.push({
          menuItemId: entry.id!,
          image: entry.image,
          index: i
        });
      }
    };

    /**
     * 2. 画像のアップロード
     * 3. 画像のURLを設定
     * 4. image削除
     * 5. MenuItem仕分け
     * 6. PrismaからDBを更新
     */
    if (imagesToUpload.length > 0) {
      await Promise.all(
        imagesToUpload.map(async (upload) => {
          await _uploadImage(upload.menuItemId, upload.image)
            .then(() => {
              console.log(`画像のアップロードに成功しました: ${upload.menuItemId}`);
              // アップロード後、画像URLを設定（404防止）
              menuItems[upload.index].imageUrl =
                `https://gauvehvvywdffzavofsf.supabase.co/storage/v1/object/public/menu-images/public/${upload.menuItemId}`;
            })
        })
      ).then(async () => {
        // 4. image削除 → 5. MenuItem仕分け → 6. PrismaからDBを更新
        await updateRDB(menuItems);
      }).catch((error) => {
        throw new Error(`画像のアップロードに失敗しました: ${error}`);
      });
    } else {
      // 画像がない場合はそのままDBを更新
      await updateRDB(menuItems);
    }

    return {
      success: true,
      message: 'メニューの更新に成功しました。',
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}
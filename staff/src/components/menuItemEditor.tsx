'use client';
import { Prisma } from '@prisma/client';
import { useReducer, useState, useTransition } from 'react';
import { MenuItemEditorCard } from './menuItemEditorCard';
import { uploadImage, upsertOrDeleteMenuItems } from '@/libs/actions/orderActions';
import { createId } from '@paralleldrive/cuid2';

export type ReducerAction =
  | { type: 'add' }
  | {
    type: 'update',
    // 更新時は更新する項目だけを指定
    menuItem: { [key in keyof Prisma.MenuItemCreateInput]?: Prisma.MenuItemCreateInput[key] },
    index: number
  }
  | { type: 'remove', index: number }
  | { type: 'uploadImage', index: number, image: File };

type MenuItemEditorEntry = Prisma.MenuItemCreateInput & { image?: File };

export function MenuItemEditor(props: { initialMenuItems: MenuItemEditorEntry[] }) {
  const { initialMenuItems } = props;

  const defaultMenuItem: MenuItemEditorEntry = {
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
  };
  const reducer = (state: MenuItemEditorEntry[], action: ReducerAction): MenuItemEditorEntry[] => {
    switch (action.type) {
      // 現在の配列の後ろにオブジェクトを一つ追加する
      case 'add':
        // 画像アップロード時にidを使いたいのでクライアント側でcuidを生成
        const newEntry: MenuItemEditorEntry = { ...defaultMenuItem, id: createId() };
        return [...state, newEntry];

      // 配列内のindexで指定したオブジェクトのkeyにvalueをセットする
      case 'update':
        return [
          ...state.slice(0, action.index),
          { ...state[action.index], ...action.menuItem },
          ...state.slice(action.index + 1),
        ]

      // 配列内のindexで指定したオブジェクトを配列から削除する
      case 'remove':
        console.log('削除するアイテム:', state[action.index]);
        if (state[action.index].id !== undefined) {
          // 削除するアイテムのIDを保存
          console.log('アイテムを削除します。ID:', state[action.index].id);
          setItemsToDelete((prev) => [...prev, state[action.index].id!]);
          console.log('削除対象のIDリスト:', itemsToDelete);
        }
        return [...state.slice(0, action.index), ...state.slice(action.index + 1)]

      // 配列内のindexで指定したオブジェクトのimageを更新する
      case 'uploadImage':
        return [
          ...state.slice(0, action.index),
          { ...state[action.index], image: action.image },
          ...state.slice(action.index + 1),
        ];
    }
  }
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const [isConnectingDB, startDBTransition] = useTransition();
  const [isUploadingImages, startImageUploadTransition] = useTransition();
  const [menuItemsState, dispatch] = useReducer(reducer, initialMenuItems);

  const handleSave = async () => {
    type ImageUpload = {
      menuItemId: string,
      image: File,
      index: number,
      status: 'success' | 'error' | 'pending'
    };
    const itemsToCreate: Prisma.MenuItemCreateInput[] = [];
    const itemsToUpdate: Prisma.MenuItemUpdateInput[] = [];
    const imagesToUpload: ImageUpload[] = [];

    /// 1. アップロードする画像の仕分け
    for (let i = 0; i < menuItemsState.length; i++) {
      const entry = menuItemsState[i];

      // 画像がある場合はアップロード対象に追加
      if (entry.image != undefined) {
        // 画像のサイズチェック（5MB以下）
        if (entry.image!.size > 5 * 1024 * 1024 /* 5MB */) {
          alert(`${entry.name}の画像アップロードをスキップしました。\n
            画像のサイズが大きすぎます。5MB以下の画像を選択してください。`);
          return;
        }
        imagesToUpload.push({
          menuItemId: entry.id!,
          image: entry.image,
          index: i,
          status: 'pending'
        });
      }
    };

    ///  2. 画像のアップロード → 3. 画像のURLを設定
    if (imagesToUpload.length > 0) {
      startImageUploadTransition(() => {
        imagesToUpload.forEach(async (upload) => {
          try {
            // 画像をアップロード
            uploadImage(upload.menuItemId, upload.image)
              .then(() => {
                console.log(`画像のアップロードに成功しました: ${upload.menuItemId}`);

                // アップロード後、画像URLを設定（404防止）
                dispatch({
                  type: 'update',
                  index: upload.index,
                  menuItem: { imageUrl: `https://gauvehvvywdffzavofsf.supabase.co/storage/v1/object/public/menu-images/public/${upload.menuItemId}` }
                });
              })
          } catch (error) {
            //TODO: 表示の仕方を変える
            alert(`
              画像のアップロードに失敗しました\n
              id: ${upload.menuItemId}\n
              エラー: ${error}`);
          }
        });
      });
    }

    /// 4. image削除 → 5. MenuItem仕分け
    for (let i = 0; i < menuItemsState.length; i++) {
      // Prisaの入力型に合わせて、imageフィールドを削除
      delete menuItemsState[i].image
      const createItem = menuItemsState[i] as Prisma.MenuItemCreateInput;

      // menuItemをupdateかcreateに仕分け
      if (createItem.createdAt === undefined) {
        itemsToCreate.push(createItem);
      } else {
        itemsToUpdate.push(createItem as Prisma.MenuItemUpdateInput);
      }
    };

    /// 6. PrismaからDBを更新
    startDBTransition(() => {
      upsertOrDeleteMenuItems(
        itemsToCreate,
        itemsToUpdate,
        itemsToDelete
      ).then(() => {
        // 成功時の処理
        // TODO: 何かしら表示する
        console.log('メニューアイテムの保存に成功しました');
      }).catch((error) => {
        // エラー時の処理
        // TODO: 何かしら表示する
        console.error('メニューアイテムの保存に失敗しました:', error);
      });
    });
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4 gap-4'>
        <button
          onClick={() => dispatch({ type: 'add' })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
        >
          追加
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
        >
          {isUploadingImages ?
            isConnectingDB ?
              'メニュー情報を保存しています...'
              : '画像をアップロードしています...'
            : '保存'}
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {menuItemsState?.map((item, index) => (
          <MenuItemEditorCard key={item.id} menuItem={item} dispatch={dispatch} index={index} />)
        )}
      </div>
    </>
  );
};

'use client';
import { Prisma } from '@prisma/client';
import { useReducer, useState, useTransition } from 'react';
import { MenuItemEditorCard } from './menuItemEditorCard';
import { updateMenu } from '@/libs/actions/menuActions';
import { createId } from '@paralleldrive/cuid2';
import { Loader2, Plus, SaveAll } from 'lucide-react';
import { supabase } from '@/libs/db/supabase';

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

export type MenuItemEditorEntry = Prisma.MenuItemCreateInput & { image?: File };

export function MenuItemEditor(props: { initialMenuItems: MenuItemEditorEntry[] }) {
  const { initialMenuItems } = props;

  const defaultMenuItem: MenuItemEditorEntry = {
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
  };
  const reducer = (state: MenuItemEditorEntry[], action: ReducerAction): MenuItemEditorEntry[] => {
    console.log('Reducer called! action:', action);
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
  const [isPending, startTransition] = useTransition();
  const [menuItemsState, dispatch] = useReducer(reducer, initialMenuItems);


  async function _uploadImage(
    menuItemId: string,
    file: File
  ) {
    try {
      if (!file) throw new Error('No file selected for upload')

      const { error } = await supabase.storage
        .from('menu-images')
        .upload(`public/${menuItemId}`, file, { upsert: true })

      if (error) throw error
    } catch (e) {
      throw e
    }
  }

  const handleSave = () => {
    console.log('menuItemsState:', menuItemsState);
    type ImageUpload = {
      menuItemId: string,
      image: File,
      index: number
    };
    const imagesToUpload: ImageUpload[] = [];

    // 1. アップロードする画像の仕分け
    for (let i = 0; i < menuItemsState.length; i++) {
      const entry = menuItemsState[i];
      // 画像がある場合はアップロード対象に追加
      if (entry.image != undefined) {
        imagesToUpload.push({
          menuItemId: entry.id!,
          image: entry.image,
          index: i
        });
      }
    };

    let menuItems: Prisma.MenuItemCreateManyInput[] = menuItemsState;

    if (imagesToUpload.length > 0) {
      Promise.all(
        imagesToUpload.map(async (upload) => {
          await _uploadImage(upload.menuItemId, upload.image)
            .then(() => {
              // アップロード後、画像URLを設定（404防止）
              menuItems = reducer(menuItems,
                {
                  type: 'update',
                  menuItem: {
                    imageUrl:
                      `https://gauvehvvywdffzavofsf.supabase.co/storage/v1/object/public/menu-images/public/${upload.menuItemId}`,
                  },
                  index: upload.index
                });
            })
        })
      ).then(() => {
        // 4. image削除 → 5. MenuItem仕分け → 6. PrismaからDBを更新
        startTransition(async () => {
          await updateMenu(menuItems)
        });
      }).catch((error) => {
        throw new Error(`画像のアップロードに失敗しました: ${error}`);
      });
    } else {
      // 画像がない場合はそのままDBを更新
      startTransition(async () => {
        await updateMenu(menuItems)
      });
    }
  }

  return (
    <>
      <div className='flex justify-start items-center mb-4 pb-4 border-b w-full gap-2'>
        <button
          onClick={() => dispatch({ type: 'add' })}
          className='hover:bg-foreground/5 focus-visible:outline-offset-2 rounded-full p-2 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none'
        >
          <Plus className='size-5' />
        </button>
        <button
          onClick={handleSave}
          className='hover:bg-foreground/5 focus-visible:outline-offset-2 rounded-full p-2 flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none'
        >
          {!isPending ?
            <SaveAll className='size-5' />
            : <Loader2 className="animate-spin size-5" />}
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {menuItemsState?.map((item, index) => (
          <MenuItemEditorCard key={item.id} menuItem={item} dispatch={dispatch} index={index} />)
        )}
      </div>
    </>
  );
};

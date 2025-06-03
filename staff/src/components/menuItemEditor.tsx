'use client';
import { MenuItem, Prisma } from '@prisma/client';
import { useReducer, useState, useTransition } from 'react';
import { MenuItemEditorCard } from './menuItemEditorCard';
import { upsertOrDeleteMenuItems } from '@/libs/actions/orderActions';

export type ReducerAction =
  | {
    type: 'update',
    // 更新時は更新する項目だけを指定
    menuItem: { [key in keyof Prisma.MenuItemCreateInput]?: Prisma.MenuItemCreateInput[key] },
    index: number
  }
  | { type: 'add' }
  | { type: 'remove', index: number };

export function MenuItemEditor(props: { initialMenuItems: MenuItem[] }) {
  const { initialMenuItems } = props;
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);

  const defaultMenuItem: Prisma.MenuItemCreateInput = {
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
  };
  const reducer = (state: Prisma.MenuItemCreateInput[], action: ReducerAction): Prisma.MenuItemCreateInput[] => {
    switch (action.type) {
      // 現在の配列の後ろにオブジェクトを一つ追加する
      case 'add':
        return [...state, defaultMenuItem];

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
    }
  }

  const [currentMenuItem, dispatch] = useReducer(reducer, initialMenuItems);

  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    const itemsToCreate: Prisma.MenuItemCreateInput[] = [];
    const itemsToUpdate: Prisma.MenuItemUpdateInput[] = [];
    currentMenuItem.forEach((item) => {
      if (item.id === undefined) {
        // 新規作成するアイテム
        itemsToCreate.push(item);
      } else {
        // 更新するアイテム
        itemsToUpdate.push(item as Prisma.MenuItemUpdateManyMutationInput);
      }
    });
    console.log('itemsToDelete:', itemsToDelete);
    startTransition(() => {
      upsertOrDeleteMenuItems(
        itemsToCreate,
        itemsToUpdate,
        itemsToDelete
      ).then(() => {
        // 成功時の処理
        // TODO: ダイアログとか出す
        console.log('メニューアイテムの保存に成功しました');
      }).catch((error) => {
        // エラー時の処理
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
          {isPending ? '保存中...' : '保存'}
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {currentMenuItem?.map((item, index) => (
          <MenuItemEditorCard key={item.id} menuItem={item} dispatch={dispatch} index={index} />)
        )}
      </div>
    </>
  );
};

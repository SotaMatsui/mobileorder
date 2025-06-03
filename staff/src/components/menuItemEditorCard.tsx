'use client';
import { Prisma } from '@prisma/client';
import { ActionDispatch } from 'react';
import { ReducerAction } from '@/components/menuItemEditor';
export function MenuItemEditorCard(props: {
  menuItem: Prisma.MenuItemCreateInput,
  index: number,
  dispatch: ActionDispatch<[action: ReducerAction]>
}) {
  const { menuItem, index, dispatch } = props;

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between bg-foreground/10 rounded-tl-md rounded-tr-md px-2 py-1.5 text-sm'>
        {menuItem.name}
        <button
          onClick={() => {
            dispatch({ type: 'remove', index: index });
          }}
          className='text-red-500 hover:text-red-700'
        >
          削除
        </button>
      </div>
      <div className='bg-foreground/5 rounded-bl-md rounded-br-md p-2'>
        <input
          type="text"
          value={menuItem.name}
          onChange={(e) => {
            dispatch({
              type: 'update',
              index: index,
              menuItem: {
                name: e.target.value,
              }
            })
          }}
          className='w-full mb-2 p-1 border border-gray-300 rounded'
        />
        <textarea
          value={menuItem.description || ''}
          onChange={(e) => {
            dispatch({
              type: 'update',
              index: index,
              menuItem: {
                description: e.target.value
              }
            })
          }}
          className='w-full mb-2 p-1 border border-gray-300 rounded'
        />
        <input
          type="number"
          value={menuItem.price}
          onChange={(e) => {
            dispatch({
              type: 'update',
              index: index,
              menuItem: {
                price: parseInt(e.target.value)
              }
            })
          }}
          className='w-full mb-2 p-1 border border-gray-300 rounded'
        />
        <p className='block mb-2'>
          <label htmlFor='isAvailable' className='text-sm'>注文可能</label>
          <input
            type="checkbox"
            checked={menuItem.isAvailable}
            id='isAvailable'
            name='isAvailable'
            onChange={(e) => {
              dispatch({
                type: 'update',
                index: index,
                menuItem: {
                  isAvailable: e.target.checked
                }
              })
            }}
            className='ml-2'
          />
        </p>
        <input
          type="text"
          value={menuItem.imageUrl || ''}
          onChange={(e) => {
            dispatch({
              type: 'update',
              index: index,
              menuItem: {
                imageUrl: e.target.value
              }
            })
          }}
          className='w-full mb-2 p-1 border border-gray-300 rounded'
        />
      </div>
    </div>
  );
};

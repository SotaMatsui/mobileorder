'use client';
import { Prisma } from '@prisma/client';
import { ActionDispatch } from 'react';
import { ReducerAction } from '@/components/menuItemEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { FileImageIcon, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from './ui/textarea';
export function MenuItemEditorCard(props: {
  menuItem: Prisma.MenuItemCreateInput,
  index: number,
  dispatch: ActionDispatch<[action: ReducerAction]>
}) {
  const { menuItem, index, dispatch } = props;

  return (
    <div style={{ '--image-url': `url(${menuItem.imageUrl})` } as React.CSSProperties}
      className={'flex flex-col max-w-sm text-white dark:bg-foreground/20 bg-linear-to-b bg-[image:linear-gradient(var(--tw-gradient-stops)),_var(--image-url)] from-black/50 to-black/50 bg-cover rounded-md'}>
      <div className='flex justify-end items-center px-2 py-1.5'>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost'>
                <FileImageIcon className='size-4' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>商品画像の設定</DialogTitle>
                <DialogDescription>
                  メニューに表示される商品画像を設定します。画像のアップロードは、保存ボタンを押したタイミングで行われます。
                </DialogDescription>
              </DialogHeader>
              <input type='file' onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  dispatch({
                    type: 'uploadImage',
                    index: index,
                    image: file
                  });
                }
              }}
                className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500 ..."
              />
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => {
              dispatch({ type: 'remove', index: index });
            }}
            variant='ghost'
          >
            <Trash2 className='size-4 text-red-500' />
          </Button>
        </div>
      </div>
      <div className='p-2'>
        <Label htmlFor='name' className='text-sm mb-1'>商品名</Label>
        <Input
          id='name'
          name='name'
          placeholder='商品名'
          autoComplete='off'
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
        />
        <Label htmlFor='description' className='text-sm mb-1'>商品説明</Label>
        <Textarea
          value={menuItem.description || ''}
          className='inline-block field-sizing-fixed'
          onChange={(e) => {
            dispatch({
              type: 'update',
              index: index,
              menuItem: {
                description: e.target.value
              }
            })
          }}
        />
        <Label htmlFor='price' className='text-sm mb-1'>価格</Label>
        <div className='flex items-center gap-1'>
          <span>¥</span>
          <Input
            id='price'
            name='price'
            placeholder='価格'
            autoComplete='off'
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
            className='grow'
          />
        </div>
        <div className='flex justify-between items-center pt-2'>
          <label htmlFor='isAvailable' className='text-sm'>注文を一時停止</label>
          <Switch
            checked={!(menuItem.isAvailable)}
            onCheckedChange={(checked) => {
              dispatch({
                type: 'update',
                index: index,
                menuItem: {
                  isAvailable: !checked
                }
              })
            }}
            id='isAvailable'
            className='mr-2'
          />
        </div>
      </div>
    </div>
  );
};

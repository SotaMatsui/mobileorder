import { MenuItem } from '@prisma/client';

// 注文アイテムの型定義
export interface OrderItem {
  menuItemId: string;
  quantity: number;
}


// カートエントリクラス - 同じメニューアイテムをまとめて管理
export class CartEntry {
  private _menuItem: MenuItem;
  private _quantity: number;

  constructor(menuItem: MenuItem, quantity: number = 1) {
    this._menuItem = menuItem;
    this._quantity = Math.max(1, quantity); // 最小数量は1
  }

  // ゲッター
  get menuItem(): MenuItem {
    return this._menuItem;
  }

  get quantity(): number {
    return this._quantity;
  }

  get menuItemId(): string {
    return this._menuItem.id;
  }

  get name(): string {
    return this._menuItem.name;
  }

  get price(): number {
    return this._menuItem.price;
  }

  get isAvailable(): boolean {
    return this._menuItem.isAvailable;
  }

  // 小計を計算（価格 × 数量）
  get subtotal(): number {
    return this._menuItem.price * this._quantity;
  }

  // 数量を増加
  increaseQuantity(amount: number = 1): void {
    if (amount > 0) {
      this._quantity += amount;
    }
  }

  // 数量を減少
  decreaseQuantity(amount: number = 1): void {
    if (amount > 0) {
      this._quantity = Math.max(1, this._quantity - amount);
    }
  }

  // 数量を設定
  setQuantity(quantity: number): void {
    this._quantity = Math.max(1, quantity);
  }

  // カートエントリが同じメニューアイテムかチェック
  isSameMenuItem(menuItemId: string): boolean {
    return this._menuItem.id === menuItemId;
  }

  // カートエントリが同じメニューアイテムかチェック（MenuItemオブジェクトで比較）
  isSameMenuItemObject(menuItem: MenuItem): boolean {
    return this._menuItem.id === menuItem.id;
  }

  // JSON形式で出力（注文時などに使用）
  toOrderItem(): OrderItem {
    return {
      menuItemId: this._menuItem.id,
      quantity: this._quantity,
    };
  }

  // 表示用の情報を取得
  getDisplayInfo(): {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    isAvailable: boolean;
  } {
    return {
      id: this._menuItem.id,
      name: this._menuItem.name,
      price: this._menuItem.price,
      quantity: this._quantity,
      subtotal: this.subtotal,
      isAvailable: this._menuItem.isAvailable,
    };
  }
}

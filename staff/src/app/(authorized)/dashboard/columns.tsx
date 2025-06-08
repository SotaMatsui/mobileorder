"use client"
import { OrderStatusSelector } from "@/components/order-status-selector"
import { Order } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import 'dayjs/locale/ja'
import * as relativeTime from 'dayjs/plugin/relativeTime'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  status: string
  orderDate: Date
  quantity: number
  name: string,
  order: Order
  tableNumber: number
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "name",
    header: "商品名",
  },
  {
    accessorKey: "quantity",
    header: "数量",
  },
  {
    accessorKey: "orderDate",
    header: "注文からの経過時間",
    cell: ({ row }) => {
      dayjs.locale('ja');
      dayjs.extend(relativeTime.default)

      const orderCol = row.original
      return dayjs(orderCol.orderDate).fromNow(false)
    },
  },
  {
    accessorKey: "tableNumber",
    header: "テーブル番号",
  },
  {
    accessorKey: "status",
    header: "状態",
    cell: ({ row }) => {
      const orderCol = row.original
      return (
        <OrderStatusSelector
          order={orderCol.order}
        />
      )
    },
  },
]
"use client"
import { OrderStatusSelector } from "@/components/order-status-selector"
import { Order } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  status: string
  orderDate: Date
  quantity: number
  name: string,
  order: Order
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "status",
    header: "状態",
    cell: ({ row }) => {
      const payment = row.original
      return (
        <OrderStatusSelector
          order={payment.order}
        />
      )
    },
  },
  {
    accessorKey: "orderDate",
    header: "オーダー日時",
  },
  {
    accessorKey: "name",
    header: "商品名",
  },
  {
    accessorKey: "quantity",
    header: "数量",
  },
]
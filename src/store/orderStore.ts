import { create } from 'zustand'
import { Order } from '@/types/order'

interface OrderStore {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  updateOrderStatus: (orderId: string, status: string) => void
  updatePaymentStatus: (orderId: string, isPaid: boolean) => void
  addOrder: (order: Order) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ),
    })),
  updatePaymentStatus: (orderId, isPaid) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, paymentStatus: isPaid } : order
      ),
    })),
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
}))
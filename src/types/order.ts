export interface Order {
  _id: string;
  userId: string;
  items: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  paymentStatus: boolean;
  createdAt: string;
  updatedAt: string;
}
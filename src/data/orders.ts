// This file contains the mock data for orders
// In a real application, this would come from an API

export const orders = [
    {
      _id: "67f60a55c99eb55a5df8eadd",
      userId: "user67d7c61350abf3a4b4edc548123",
      items: [
        {
          dishId: "67ecd155f1235c8f924c73de",
          name: "idli",
          quantity: 2,
          price: 90,
          totalPrice: 180,
          _id: "67f60a55c99eb55a5df8eade",
        },
      ],
      subtotal: 21.98,
      discount: 2,
      serviceFee: 1.5,
      deliveryFee: 3,
      totalAmount: 24.48,
      status: "ordered",
      paymentStatus: false,
      createdAt: "2025-04-09T05:49:09.396Z",
      updatedAt: "2025-04-09T05:49:09.396Z",
      __v: 0,
    },
  ]
  
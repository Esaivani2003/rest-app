import { NextApiRequest, NextApiResponse } from "next";
import Order from "@/models/order";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { 
        userId, 
        items, 
        subtotal, 
        discount, 
        serviceFee, 
        deliveryFee, 
        totalAmount 
      } = req.body;

      // Validate required fields
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      // Create new order
      const newOrder = new Order({
        userId,
        items: items.map(item => ({
          dishId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity
        })),
        subtotal,
        discount,
        serviceFee,
        deliveryFee,
        totalAmount,
        status: 'ordered',
        paymentStatus: false
      });

      await newOrder.save();
      return res.status(201).json({ 
        message: "Order created successfully", 
        order: newOrder 
      });

    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Error creating order" });
    }
  }

  if (req.method === "GET") {
    try {
    //   const { userId, status } = req.query;
      const { userId } = req.query;
      let query = {};

      // Filter by userId if provided
      if (userId) {
        query = { ...query, userId };
      }

      // Filter by status if provided
    //   if (status) {
    //     query = { ...query, status };
    //   }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.status(200).json(orders);

    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: "Error fetching orders" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: "Order ID and status are required" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.status(200).json({ 
        message: "Order status updated", 
        order: updatedOrder 
      });

    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ error: "Error updating order" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
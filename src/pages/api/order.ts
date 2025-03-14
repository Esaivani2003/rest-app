import { NextApiRequest, NextApiResponse } from "next";

// Temporary storage for orders (will be lost when server restarts)
let orders: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Get all orders
    return res.status(200).json(orders);
  } else if (req.method === "POST") {
    // Create a new order
    const { name, items, total } = req.body;

    if (!name || !items || items.length === 0 || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = {
      id: orders.length + 1,
      name,
      items,
      total,
      date: new Date().toISOString(),
    };

    orders.push(newOrder);
    return res.status(201).json(newOrder);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
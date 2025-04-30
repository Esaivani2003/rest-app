import { NextApiRequest, NextApiResponse } from "next";

type Dish = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

let dishes: Dish[] = [
  { id: 1, name: "Pizza Margherita", price: 10, quantity: 1 },
  { id: 2, name: "Spaghetti Carbonara", price: 12, quantity: 1 },
  { id: 3, name: "Caesar Salad", price: 8, quantity: 1 },
];

// import { NextApiRequest, NextApiResponse } from "next";
import Order from "@/models/order";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();
  

    if (req.method === "PUT") {
      const { id, status } = req.body;
    
      if (!id || !status) {
        return res.status(400).json({ error: "ID and status are required" });
      }
    
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
    
      return res.status(200).json({ message: "Order updated", order: updatedOrder });
    }
    

  return res.status(405).json({ message: "Method Not Allowed" });
}

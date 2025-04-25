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
  
  if (req.method === "GET") {
      try {
      //   const { userId, status } = req.query;
        // const { userId } = req.query;
        // let query = {};
  
        // Filter by userId if provided
        // if (userId) {
        //   query = { ...query, userId };
        // }
  
        // Filter by status if provided
      //   if (status) {
      //     query = { ...query, status };
      //   }
  
        const orders = await Order.find();
        return res.status(200).json(orders);
  
      } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Error fetching orders" });
      }
    }

  if (req.method === "POST") {
    const { id, name, price, quantity } = req.body;

    if (!id || !name || !price || quantity === undefined) {
      return res.status(400).json({ error: "ID, name, price, and quantity are required" });
    }

    const existingDish = dishes.find((dish) => dish.id === id);

    if (existingDish) {
      dishes = dishes.map((dish) =>
        dish.id === id ? { ...dish, quantity } : dish
      );
      return res.status(200).json({ message: "Quantity updated", dishes });
    } else {
      const newDish = { id, name, price, quantity };
      dishes.push(newDish);
      return res.status(201).json({ message: "New dish added", dish: newDish });
    }
  }

  if (req.method === "PUT") {
    const { id, quantity } = req.body;

    if (!id || quantity === undefined) {
      return res.status(400).json({ error: "ID and quantity are required" });
    }

    let updatedDish: Dish | null = null;
    dishes = dishes.map((dish) => {
      if (dish.id === id) {
        updatedDish = { ...dish, quantity };
        return updatedDish;
      }
      return dish;
    });

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    return res.status(200).json({ message: "Dish updated", dish: updatedDish });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const dishIndex = dishes.findIndex((dish) => dish.id === Number(id));

    if (dishIndex === -1) {
      return res.status(404).json({ error: "Dish not found" });
    }

    const deletedDish = dishes[dishIndex];
    dishes = dishes.filter((dish) => dish.id !== Number(id));

    return res.status(200).json({ message: "Dish deleted", dish: deletedDish });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

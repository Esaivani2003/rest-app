import { NextApiRequest, NextApiResponse } from "next";
import FoodItem from "@/models/fooditem"; // Adjust path as needed
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { name, description, price, category, image, discount, addons } = req.body;

      if (!name || !description || !price || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create new food item
      const newFoodItem = new FoodItem({ name, description, price, category, image, discount, addons });
      await newFoodItem.save();

      return res.status(201).json({ newFoodItem, success: true });
    } catch (error) {
      return res.status(500).json({ message: "Error creating food item", error });
    }
  } 
  
  else if (req.method === "GET") {
    try {
      const foodItems = await FoodItem.find();
      return res.status(200).json(foodItems);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching food items", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

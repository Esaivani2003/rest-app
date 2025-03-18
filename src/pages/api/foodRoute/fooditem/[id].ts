import { NextApiRequest, NextApiResponse } from "next";
import FoodItem from "@/models/fooditem"; // Adjust the path if needed
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query; // Get food item ID from URL

  if (req.method === "GET") {
    // ✅ GET Food Item by ID
    try {
      const foodItem = await FoodItem.findById(id);
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.status(200).json(foodItem);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching food item", error });
    }
  } 
  
  else if (req.method === "PUT") {
    // ✅ UPDATE Food Item
    try {
      const { name, description, price, category, image, discount, addons } = req.body;
      
      const updatedFoodItem = await FoodItem.findByIdAndUpdate(
        id,
        { name, description, price, category, image, discount, addons },
        { new: true }
      );

      if (!updatedFoodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      return res.status(200).json(updatedFoodItem);
    } catch (error) {
      return res.status(500).json({ message: "Error updating food item", error });
    }
  } 
  
  else if (req.method === "DELETE") {
    // ✅ DELETE Food Item
    try {
      const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
      if (!deletedFoodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting food item", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

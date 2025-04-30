import { NextApiRequest, NextApiResponse } from "next";
import FoodItem from "@/models/fooditem";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { name, description, price, category, image, discount = 0, addons = [] } = req.body;

      // Validation
      if (!name || !description || !price || !category) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Optional Base64 image validation
      if (image) {
        const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/;
        if (!base64Pattern.test(image)) {
          return res.status(400).json({ message: "Invalid Base64 image format" });
        }
      }

      // Validate category against allowed list (as per schema)
      const allowedCategories = [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Dessert",
        "Beverage",
        "Fast Food",
        "Main Course",
        "Breakfast",
        "Low Carb",
        "Sugar Free",
        "High Fiber",
        "Low Sodium",
        "Heart Healthy",
        "Low Fat"
      ];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }

      // Parse addons safely
      const parsedAddons = Array.isArray(addons) ? addons : [];

      const newFoodItem = new FoodItem({
        name: name.trim(),
        description,
        price: parseFloat(price),
        category,
        image: image || "", // store Base64 or empty string
        discount: parseFloat(discount),
        addons: parsedAddons
      });

      await newFoodItem.save();

      return res.status(201).json({ success: true, newFoodItem });
    } catch (error) {
      console.error("Error creating food item:", error);
      return res.status(500).json({ message: "Error creating food item", error });
    }
  }

  if (req.method === "GET") {
    try {
      const foodItems = await FoodItem.find();
      return res.status(200).json(foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      return res.status(500).json({ message: "Error fetching food items", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

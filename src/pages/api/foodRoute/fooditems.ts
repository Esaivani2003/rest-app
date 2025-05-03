import { NextApiRequest, NextApiResponse } from "next";
import FoodItem from "@/models/fooditem";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const {
        name,
        description,
        price,
        category,
        FoodCategory,
        FoodType,
        image,
        discount = 0,
        addons = [],
      } = req.body;

      console.log("Received data:", req.body);

      // Validation
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !FoodCategory ||
        !FoodType
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Optional Base64 image validation
      if (image) {
        const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/;
        if (!base64Pattern.test(image)) {
          return res
            .status(400)
            .json({ message: "Invalid Base64 image format" });
        }
      }

      // Parse addons safely
      const parsedAddons = Array.isArray(addons) ? addons : [];

      const newFoodItem = new FoodItem({
        name: name.trim(),
        description,
        FoodCategory,
        FoodType,
        price: parseFloat(price),
        category,
        image: image || "",
        discount: parseFloat(discount),
        addons: parsedAddons,
      });

      await newFoodItem.save();

      return res.status(201).json({ success: true, newFoodItem });
    } catch (error: unknown) {
      console.error("Error creating food item:", error);
    
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
    
      return res.status(500).json({ message: "Error creating food item", error: errorMessage });
    }
    
  }

  if (req.method === "GET") {
    try {
      const foodItems = await FoodItem.find();
      return res.status(200).json(foodItems);
    } catch (error: unknown) {
      console.error("Error creating food item:", error);
    
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
    
      return res.status(500).json({ message: "Error creating food item", error: errorMessage });
    }
    
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

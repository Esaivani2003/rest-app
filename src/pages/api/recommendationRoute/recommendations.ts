import { NextApiRequest, NextApiResponse } from "next";
import FoodItem from "@/models/fooditem";
import connectToDatabase from "@/DB/mongodb";

// Define types for health recommendations
type DiseaseRecommendation = {
  disease: string;
  avoid: string[];
  recommended: string[];
  categories: string[];
};

// Health recommendations database
const healthRecommendations: { [key: string]: DiseaseRecommendation } = {
  diabetes: {
    disease: "diabetes",
    avoid: ["sugar", "refined carbs", "fried foods"],
    recommended: ["whole grains", "leafy greens", "lean proteins"],
    categories: ["Low Carb", "Sugar Free", "High Fiber"]
  },
  hypertension: {
    disease: "hypertension",
    avoid: ["salt", "fatty foods", "processed foods"],
    recommended: ["fruits", "vegetables", "lean meats"],
    categories: ["Low Sodium", "Heart Healthy"]
  },
  cholesterol: {
    disease: "cholesterol",
    avoid: ["saturated fats", "trans fats", "fried foods"],
    recommended: ["omega-3 rich foods", "fiber-rich foods", "lean proteins"],
    categories: ["Low Fat", "Heart Healthy"]
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectToDatabase();

  try {
    const { disease } = req.query;

    if (!disease || typeof disease !== "string") {
      return res.status(400).json({ error: "Disease parameter is required" });
    }

    const recommendation = healthRecommendations[disease.toLowerCase()];

    if (!recommendation) {
      return res.status(404).json({ error: "No recommendations found for this disease" });
    }

    // Get recommended dishes from the database based on categories
    const recommendedDishes = await FoodItem.find({
      category: { $in: recommendation.categories }
    }).select('name description price category image');

    return res.status(200).json({
      disease: recommendation.disease,
      recommendations: {
        avoid: recommendation.avoid,
        recommended: recommendation.recommended,
      },
      dishes: recommendedDishes
    });

  } catch (error) {
    console.error("Error in recommendations API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
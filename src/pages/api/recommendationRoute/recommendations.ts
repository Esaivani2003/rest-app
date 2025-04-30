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
    categories: ["Low Carb", "Sugar Free", "High Fiber"],
  },
  hypertension: {
    disease: "hypertension",
    avoid: ["salt", "fatty foods", "processed foods"],
    recommended: ["fruits", "vegetables", "lean meats"],
    categories: ["Low Sodium", "Heart Healthy"],
  },
  cholesterol: {
    disease: "cholesterol",
    avoid: ["saturated fats", "trans fats", "fried foods"],
    recommended: ["omega-3 rich foods", "fiber-rich foods", "lean proteins"],
    categories: ["Low Fat", "Heart Healthy"],
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectToDatabase();

  try {
    const { diseases } = req.body;

    if (!Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({ error: "Diseases array is required" });
    }

    // Merge recommendations from all diseases
    const mergedRecommendations = diseases.reduce(
      (acc, disease) => {
        const recommendation = healthRecommendations[disease.toLowerCase()];
        if (recommendation) {
          acc.avoid.push(...recommendation.avoid);
          acc.recommended.push(...recommendation.recommended);
          acc.categories.push(...recommendation.categories);
        }
        return acc;
      },
      {
        avoid: [] as string[],
        recommended: [] as string[],
        categories: [] as string[],
      }
    );

    if (mergedRecommendations.categories.length === 0) {
      return res.status(404).json({ error: "No valid recommendations found for given diseases" });
    }

    // Remove duplicates
    const uniqueCategories = [...new Set(mergedRecommendations.categories)];
    const uniqueAvoid = [...new Set(mergedRecommendations.avoid)];
    const uniqueRecommended = [...new Set(mergedRecommendations.recommended)];

    // Get recommended dishes from the database based on merged categories
    const recommendedDishes = await FoodItem.find({
      category: { $in: uniqueCategories },
    }).select("name description price category image");

    return res.status(200).json({
      diseases,
      recommendations: {
        avoid: uniqueAvoid,
        recommended: uniqueRecommended,
      },
      dishes: recommendedDishes,
    });
  } catch (error) {
    console.error("Error in recommendations API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

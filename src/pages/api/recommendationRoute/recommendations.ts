import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/DB/mongodb";
import Disease from "@/models/disease";
import FoodItem from "@/models/fooditem";

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

    // Normalize input diseases (trim & lowercase)
    const normalizedDiseases = diseases.map((d: string) => d.trim().toLowerCase());

    // Find all matching disease documents
    const matchedDiseases = await Disease.find({
      disease: { $in: normalizedDiseases }
    });

    if (!matchedDiseases || matchedDiseases.length === 0) {
      return res.status(404).json({ error: "No matching diseases found in the database" });
    }

    // Merge recommendations
    const merged = matchedDiseases.reduce(
      (acc, dis) => {
        acc.avoid.push(...dis.avoid);
        acc.recommended.push(...dis.recommended);
        acc.categories.push(...dis.categories);
        return acc;
      },
      {
        avoid: [] as string[],
        recommended: [] as string[],
        categories: [] as string[],
      }
    );

    // Deduplicate values
    const uniqueAvoid = [...new Set(merged.avoid)];
    const uniqueRecommended = [...new Set(merged.recommended)];
    const uniqueCategories = [...new Set(merged.categories)];

    if (uniqueCategories.length === 0) {
      return res.status(404).json({ error: "No recommendations found for the selected diseases" });
    }

    // Get dishes matching recommended categories
    const recommendedDishes = await FoodItem.find({
      category: { $in: uniqueCategories },
    });

    return res.status(200).json({
      diseases: normalizedDiseases,
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

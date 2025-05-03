import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/DB/mongodb";
import Disease from "@/models/disease";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    const diseases = await Disease.find();
    return res.status(200).json(diseases);
  }

  if (req.method === "POST") {
    const { disease, avoid, recommended, categories } = req.body;

    if (!disease) return res.status(400).json({ error: "Disease name is required" });

    const updated = await Disease.findOneAndUpdate(
      { disease: disease.toLowerCase() },
      {
        disease: disease.toLowerCase(),
        avoid,
        recommended,
        categories,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(updated);
  }

  // Adding PUT method to handle updating an existing disease
  if (req.method === "PUT") {
    const { disease, avoid, recommended, categories } = req.body;

    if (!disease) return res.status(400).json({ error: "Disease name is required" });

    // Find and update the disease by its name
    const updatedDisease = await Disease.findOneAndUpdate(
      { disease: disease.toLowerCase() }, // matching disease name (case insensitive)
      {
        avoid,
        recommended,
        categories,
      },
      { new: true } // returns the updated document
    );

    if (!updatedDisease) {
      return res.status(404).json({ error: "Disease not found" });
    }

    return res.status(200).json(updatedDisease);
  }

  res.status(405).json({ error: "Method not allowed" });
}

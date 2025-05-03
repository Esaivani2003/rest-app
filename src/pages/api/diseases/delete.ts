import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/DB/mongodb";
import Disease from "@/models/disease";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID is required" });

    await Disease.findByIdAndDelete(id);
    return res.status(200).json({ message: "Disease deleted" });
  }

  res.status(405).json({ error: "Method not allowed" });
}

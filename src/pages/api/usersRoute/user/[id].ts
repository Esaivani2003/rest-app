import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query; // Get user ID from URL

  if (req.method === "GET") {
    // ✅ GET User by ID
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching user", error });
    }
  } 
  
  else if (req.method === "PUT") {
    // ✅ UPDATE User
    try {
      const { name, email, phone, password, role } = req.body;

      // Hash new password if provided
      let updatedFields: any = { name, email, phone, role };
      if (password) {
        const saltRounds = 10;
        updatedFields.password = await bcrypt.hash(password, saltRounds);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Error updating user", error });
    }
  } 
  
  else if (req.method === "DELETE") {
    // ✅ DELETE User
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting user", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

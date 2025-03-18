import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";
import connectToDatabase from "@/DB/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { name, email, phone, password, role } = req.body;

      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ success: false, error: "JWT_SECRET not defined in environment variables" });
      }

      // Hash password correctly before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user with hashed password
      const newUser = new User({ name, email, phone, password: hashedPassword, role });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.name, email: newUser.email,Role:newUser.role }, 
        jwtSecret, 
        { expiresIn: "1h" }
      );

      return res.status(201).json({ newUser, success: true, token });
    } catch (error) {
      return res.status(500).json({ message: "Error creating user", error });
    }
  } 
  
  else if (req.method === "GET") {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";//
import connectToDatabase from "@/DB/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const employee = await User.findById(decoded.id);
    if (!employee) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;
    await employee.save();

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error });
  }
}

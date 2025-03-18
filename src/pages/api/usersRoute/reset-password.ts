import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/user";// Your Employee Model
import connectToDatabase from "@/DB/mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Generate a reset token (expires in 1 hour)
    const resetToken = jwt.sign({ id: employee._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    // Send Email (You need to configure your SMTP settings)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: "Password Reset Request",
      html: `<p>Click the link to reset your password: 
             <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a></p>`,
    });

    return res.status(200).json({ message: "Reset link sent to email" ,link:`${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`});

  } catch (error) {
    return res.status(500).json({ message: "Error sending reset email", error });
  }
}

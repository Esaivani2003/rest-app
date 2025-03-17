import { NextApiRequest, NextApiResponse } from "next";

let employees: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const newEmployee = req.body;
    employees.push(newEmployee);
    return res.status(201).json({ message: "Employee Added Successfully!", newEmployee });
  }
  if (req.method === "GET") {
    return res.status(200).json(employees);
  }
  res.status(405).json({ message: "Method Not Allowed" });
}

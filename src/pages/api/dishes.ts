import { NextApiRequest, NextApiResponse } from "next";

// Sample dishes data
const dishes = [
  {
    id: 1,
    name: "Avocado Toast",
    description: "Whole grain toast with fresh avocado and cherry tomatoes.",
    price: 7.99,
    image: "/images/avocado-toast.jpg",
    category: "Breakfast",
  },
  {
    id: 2,
    name: "Quinoa Salad",
    description: "A refreshing mix of quinoa, greens, and citrus dressing.",
    price: 9.99,
    image: "/images/quinoa-salad.jpg",
    category: "Lunch",
  },
  {
    id: 3,
    name: "Smoothie Bowl",
    description: "A delicious blend of berries, banana, and granola.",
    price: 6.99,
    image: "/images/smoothie-bowl.jpg",
    category: "Healthy",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(dishes);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
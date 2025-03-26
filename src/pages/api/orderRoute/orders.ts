import { NextApiRequest, NextApiResponse } from "next";

type Dish = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

let dishes: Dish[] = [
  { id: 1, name: "Pizza Margherita", price: 10, quantity: 1 },
  { id: 2, name: "Spaghetti Carbonara", price: 12, quantity: 1 },
  { id: 3, name: "Caesar Salad", price: 8, quantity: 1 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id) {
      const dish = dishes.find((dish) => dish.id === Number(id));

      if (!dish) {
        return res.status(404).json({ error: "Dish not found" });
      }

      return res.status(200).json(dish);
    }

    return res.status(200).json(dishes);
  }

  if (req.method === "POST") {
    const { id, name, price, quantity } = req.body;

    if (!id || !name || !price || quantity === undefined) {
      return res.status(400).json({ error: "ID, name, price, and quantity are required" });
    }

    const existingDish = dishes.find((dish) => dish.id === id);

    if (existingDish) {
      dishes = dishes.map((dish) =>
        dish.id === id ? { ...dish, quantity } : dish
      );
      return res.status(200).json({ message: "Quantity updated", dishes });
    } else {
      const newDish = { id, name, price, quantity };
      dishes.push(newDish);
      return res.status(201).json({ message: "New dish added", dish: newDish });
    }
  }

  if (req.method === "PUT") {
    const { id, quantity } = req.body;

    if (!id || quantity === undefined) {
      return res.status(400).json({ error: "ID and quantity are required" });
    }

    let updatedDish: Dish | null = null;
    dishes = dishes.map((dish) => {
      if (dish.id === id) {
        updatedDish = { ...dish, quantity };
        return updatedDish;
      }
      return dish;
    });

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    return res.status(200).json({ message: "Dish updated", dish: updatedDish });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const dishIndex = dishes.findIndex((dish) => dish.id === Number(id));

    if (dishIndex === -1) {
      return res.status(404).json({ error: "Dish not found" });
    }

    const deletedDish = dishes[dishIndex];
    dishes = dishes.filter((dish) => dish.id !== Number(id));

    return res.status(200).json({ message: "Dish deleted", dish: deletedDish });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

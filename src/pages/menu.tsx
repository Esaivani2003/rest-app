import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function Menu() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  // Fetch dishes from API
  useEffect(() => {
    axios.get("/api/dishes") // This will be created in the backend
      .then((response) => setDishes(response.data))
      .catch((error) => console.error("Error fetching dishes:", error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Healthy Menu</title>
      </Head>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-green-700 text-center mt-10">Our Healthy Menu</h1>

      {/* Dishes Grid */}
      <div className="container mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-bold text-green-600 mt-2">{dish.name}</h2>
            <p className="text-gray-600 mt-1">{dish.description}</p>
            <p className="text-green-700 font-bold mt-2">${dish.price.toFixed(2)}</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
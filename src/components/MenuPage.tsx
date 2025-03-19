"use client";

import React from "react";
import PizzaImage from "../../public/pizza.jpg";
import PastaImage from "../../public/pasta.jpg";
import BurgerImage from "../../public/burger.jpg";
import Image from "next/image";

interface Addon {
  name: string;
  price: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  image: any;
  discount?: number;
  addons?: Addon[];
}

const products: Product[] = [
  {
    name: "Cheese Burst Pizza",
    description: "Delicious pizza with extra cheese burst inside.",
    price: 299,
    category: "Fast Food",
    image: PizzaImage,
    discount: 12,
    addons: [
      { name: "Extra Cheese", price: 50 },
      { name: "Olives", price: 30 }
    ]
  },
  {
    name: "BBQ Chicken Burger",
    description: "Juicy chicken patty with smoky BBQ sauce.",
    price: 199,
    category: "Fast Food",
    image: BurgerImage,
    discount: 10,
    addons: [
      { name: "Extra Patty", price: 70 },
      { name: "Cheese Slice", price: 20 }
    ]
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy white sauce pasta with mushrooms.",
    price: 249,
    category: "Italian",
    image: PastaImage,
    discount: 15,
    addons: [
      { name: "Extra Parmesan", price: 40 },
      { name: "Grilled Chicken", price: 60 }
    ]
  }
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border transform hover:scale-105 transition duration-300">
      <Image src={product.image} alt={product.name} width={100} height={100} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-3">
          {product.discount ? (
            <p className="text-red-500 font-bold text-lg">
              <span className="line-through text-gray-400">₹{product.price}</span> ₹{discountedPrice}
            </p>
          ) : (
            <p className="text-green-600 font-bold text-lg">₹{product.price}</p>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
        {product.addons && product.addons.length > 0 && (
          <div className="mt-2">
            <h3 className="font-semibold text-gray-700 text-sm">Add-ons:</h3>
            <ul className="list-disc list-inside text-gray-600 text-xs">
              {product.addons.map((addon, index) => (
                <li key={index}>
                  {addon.name} - ₹{addon.price}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 relative">
     <button className="absolute top-0 left-0 m-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
  + Add Menu
</button>

      <h1 className="text-3xl font-bold text-center mb-6">Our Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

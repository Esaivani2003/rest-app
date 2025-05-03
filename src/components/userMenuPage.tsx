"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, ForkKnife } from "lucide-react";

interface Addon {
  name: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  FoodCategory: string;
  FoodType: string;
  image: string;
  discount?: number;
  addons?: Addon[];
}

const ProductCard: React.FC<{
  product: Product;
  toggleCart: (product: Product) => void;
  isInCart: boolean;
}> = ({ product, toggleCart, isInCart }) => {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border transform hover:scale-105 transition duration-300">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between gap-10 mb-4">
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 text-yellow-900 rounded-full font-semibold shadow-sm backdrop-blur-md border border-yellow-300/50">
            <BadgeCheck size={14} className="text-yellow-800" />
            {product.FoodType}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-3 py-1 text-gray-900 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
            <ForkKnife size={14} className="text-gray-800" />
            {product.FoodCategory}
          </span>
        </div>

        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-3">
          {product.discount ? (
            <p className="text-red-500 font-bold text-lg">
              <span className="line-through text-gray-400">₹{product.price}</span> ₹
              {discountedPrice}
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
                <li key={index}>{addon.name} - ₹{addon.price}</li>
              ))}
            </ul>
          </div>
        )}
        <button
  onClick={() => toggleCart(product)}
  className={`mt-4 w-full py-2 rounded-md transition-colors text-white ${
    isInCart
      ? "bg-gray-500 hover:bg-gray-600"
      : "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:via-pink-600 hover:to-pink-700"
  }`}
>
  {isInCart ? "Remove from Cart" : "Add to Cart"}
</button>


      </div>
    </div>
  );
};

const UserMenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [showPopMenu, setShowPopMenu] = useState(false);
  const [disease, setDisease] = useState<string[]>([]); // For storing disease-related information
  const [diseaseOptions, setDiseaseOptions] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  // Load Cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // Load user details or show pop menu
  useEffect(() => {
    const user = localStorage.getItem("userName");
    const table = localStorage.getItem("tableNumber");
    if (!user || !table) {
      setShowPopMenu(true);
    } else {
      setUserName(user);
      setTableNumber(table);
    }
  }, []);

  // Fetch diseases for recommendation
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diseases`);
        const data = await response.json();
        setDiseaseOptions(data.map((disease: any) => disease.disease)); // Populate disease options
      } catch (error) {
        console.error("Error fetching diseases:", error);
      }
    };
    fetchDiseases();
  }, []);

  // Fetch products based on selected diseases
  const fetchProducts = async (selectedDiseases: string[]) => {
    if (selectedDiseases.length === 0) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recommendationRoute/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ diseases: selectedDiseases }),
        }
      );

      const data = await response.json();
      setProducts(data.dishes); // Set the fetched products
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  };

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = (product: Product) => {
    setCartItems((prevCart) => {
      const isAlreadyInCart = prevCart.some((item) => item._id === product._id);
      return isAlreadyInCart
        ? prevCart.filter((item) => item._id !== product._id)
        : [...prevCart, product];
    });
  };

  const handleSubmitDiseaseDetails = () => {
    if (disease.length > 0) {
      fetchProducts(disease); // Fetch products based on selected diseases
      setShowPopMenu(false); // Close the modal
    }
  };

  return (
    <div className="relative">
      {/* PopMenu Modal */}
      {showPopMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Enter Your Health Conditions</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
              {diseaseOptions.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={disease.includes(option)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.checked) {
                        setDisease((prev) => [...prev, value]);
                      } else {
                        setDisease((prev) => prev.filter((d) => d !== value));
                      }
                    }}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSubmitDiseaseDetails}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white w-full py-2 rounded-md shadow-md hover:from-purple-500 hover:via-pink-600 hover:to-red-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="max-w-7xl mx-auto p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                toggleCart={toggleCart}
                isInCart={cartItems.some((item) => item._id === product._id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No recommended products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenuPage;

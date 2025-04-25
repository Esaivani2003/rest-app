'use client';

import { useEffect, useState } from "react";

type Dish = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function FoodOrderPage() {
  const [cartItems, setCartItems] = useState<Dish[]>([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart: Dish[] = JSON.parse(storedCart).map((item: any) => ({
        ...item,
        quantity: item.quantity || 1, // Ensure quantity exists
      }));
      setCartItems(parsedCart);
    }
  }, []);

  // Update quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Calculate total prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal >= 20 ? subtotal * 0.2 : 0;
  const serviceFee = 0.5;
  const deliveryFee = 4.0;
  const total = subtotal - discount + serviceFee + deliveryFee;

  // Handle order placement
  const handleOrder = async () => {
    try {
      const orderData = {
        userId: "user67d7c61350abf3a4b4edc548123", // Change this to dynamic if needed
        items: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        discount,
        serviceFee,
        deliveryFee,
        totalAmount: total,
      };

      const response = await fetch('/api/orderRoute/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order failed:', errorData);
        alert("Failed to place order. Please try again.");
        return;
      }

      const result = await response.json();
      console.log("Order placed successfully:", result);
      alert("Order placed successfully!");

      // Clear cart after a successful order
      localStorage.removeItem('cart');
      setCartItems([]); // Reset the state to reflect an empty cart

    } catch (e: any) {
      console.error("Error placing order:", e);
      alert("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="flex flex-col max-w-md p-6 space-y-4 sm:w-96 sm:p-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <ul className="flex flex-col pt-4 space-y-2">
          {cartItems.map((item) => (
            <li key={item._id} className="flex items-center justify-between">
              <h3>
                {item.name}{" "}
                <span className="text-sm text-violet-600">x{item.quantity}</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <div className="text-right">
                  <span className="block">₹{(item.price * item.quantity).toFixed(2)}</span>
                  <span className="text-sm text-gray-600">₹{item.price.toFixed(2)}</span>
                </div>
                <button onClick={() => removeItem(item._id)} className="text-red-500 ml-3">
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {subtotal >= 20 && (
              <div className="flex justify-between text-green-600">
                <span>Discount (20% off)</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₹{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              onClick={handleOrder}
              className="w-full py-2 font-semibold border rounded bg-violet-600 text-white"
            >
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

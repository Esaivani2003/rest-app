'use client';

import { useEffect, useState } from "react";

type Dish = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userName: string, userNumber: string) => void;
  userName: string;
  userNumber: string;
  setUserName: (value: string) => void;
  setUserNumber: (value: string) => void;
};


function OrderDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userNumber,
  setUserName,
  setUserNumber,
}: OrderDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Enter Your Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              value={userNumber}
              onChange={(e) => setUserNumber(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
          disabled={!userName || !userNumber}
            onClick={() => {
              onClose();
              onConfirm(userName, userNumber);
            }}
            className={`px-4 py-2 ${(!userName || !userNumber) ?" bg-gray-600":"bg-violet-600"}  text-white rounded`}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FoodOrderPage() {
  const [cartItems, setCartItems] = useState<Dish[]>([]);
  const [UserName,setUsername] = useState("")
  const [userNumber, setuserNumber] = useState("")
  const [showModal, setShowModal] = useState(false);

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

  const closeModal =()=>{
    setShowModal(false)
  }

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

    setShowModal(true)
   
  };

  const submitOrder = async () => {
    try {
      const orderData = {
        userId: userNumber,
        userName: UserName,
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
  
      localStorage.removeItem('cart');
      setCartItems([]);
      closeModal();
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
      <OrderDetailsModal
  isOpen={showModal}
  onClose={closeModal}
  onConfirm={() => submitOrder()}
  userName={UserName}
  userNumber={userNumber}
  setUserName={setUsername}
  setUserNumber={setuserNumber}
/>
    </div>
  );
}





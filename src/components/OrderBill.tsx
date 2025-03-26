import { useState } from "react";

type Dish = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const initialDishes: Dish[] = [
  { id: 1, name: "Hard taco, chicken", price: 2.5, quantity: 3 },
  { id: 2, name: "Hard taco, beef", price: 2.75, quantity: 3 },
  { id: 3, name: "Curly fries", price: 1.75, quantity: 1 },
  { id: 4, name: "Large soda", price: 2.0, quantity: 2 },
];

export default function FoodOrderPage() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);

  // Update quantity and price dynamically
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setDishes((prevDishes) =>
      prevDishes.map((dish) =>
        dish.id === id ? { ...dish, quantity: newQuantity } : dish
      )
    );
  };

  // Calculate total prices
  const subtotal = dishes.reduce((acc, dish) => acc + dish.price * dish.quantity, 0);
  const discount = subtotal >= 20 ? subtotal * 0.2 : 0;
  const serviceFee = 0.5;
  const deliveryFee = 4.0;
  const total = subtotal - discount + serviceFee + deliveryFee;

  return (
    <div className="flex flex-col max-w-md p-6 space-y-4 sm:w-96 sm:p-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold">Order Items</h2>
      <ul className="flex flex-col pt-4 space-y-2">
        {dishes.map((dish) => (
          <li key={dish.id} className="flex items-center justify-between">
            <h3>
              {dish.name}{" "}
              <span className="text-sm text-violet-600">x{dish.quantity}</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(dish.id, dish.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="w-6 text-center">{dish.quantity}</span>
              <button
                onClick={() => updateQuantity(dish.id, dish.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <div className="text-right">
                <span className="block">${(dish.price * dish.quantity).toFixed(2)}</span>
                <span className="text-sm text-gray-600">à ${dish.price.toFixed(2)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {subtotal >= 20 && (
          <div className="flex justify-between text-green-600">
            <span>Discount (20% off)</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>${serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 space-y-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          className="w-full py-2 font-semibold border rounded bg-violet-600 text-white"
        >
          Order
        </button>
      </div>
    </div>
  );
}

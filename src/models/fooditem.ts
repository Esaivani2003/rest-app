import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Vegetarian",
        "Non-Vegetarian",
        "Vegan",
        "Dessert",
        "Beverage",
        "Fast Food",
        "Main Course",
        "Breakfast",
      ],
    },
    image: { type: String, required: false }, // Image URL
    discount: {
      type: Number,
      default: 0, // Percentage-based discount (e.g., 10 for 10%)
      min: 0,
      max: 100,
    },
    addons: [
      {
        name: { type: String, required: true }, // Example: extra cheese, extra sauce
        price: { type: Number, required: true, min: 0 },
      },
    ],
    updatedAt: { type: Date, default: Date.now }, // Auto-update timestamp
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

export default mongoose.models.Food || mongoose.model("Food", foodSchema);

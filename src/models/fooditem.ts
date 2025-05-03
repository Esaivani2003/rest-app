import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    FoodCategory: { type: String, required: true },
    FoodType: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: false },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    addons: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const FoodItem = mongoose.models.Fooditems || mongoose.model("Fooditems", foodSchema);

export default FoodItem;

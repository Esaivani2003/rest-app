
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin","waiter","provider","chef"], default: "user" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);


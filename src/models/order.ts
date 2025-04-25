import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    items: [{
      dishId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Food',
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      price: { 
        type: Number, 
        required: true 
      },
      totalPrice: { 
        type: Number, 
        required: true 
      }
    }],
    subtotal: { 
      type: Number, 
      required: true 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    serviceFee: { 
      type: Number, 
      required: true 
    },
    deliveryFee: { 
      type: Number, 
      required: true 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['ordered', 'ready', 'delivered', 'paid'],
      default: 'ordered' 
    },
    paymentStatus: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
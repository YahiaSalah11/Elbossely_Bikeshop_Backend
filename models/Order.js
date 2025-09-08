import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike', // Reference the Bike model
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model 
    required: false // can be true if auth is required  
  },
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String } 
  }
}, {
  timestamps: true // auto adds createdAt & updatedAt
});

export default mongoose.model('Order', orderSchema);

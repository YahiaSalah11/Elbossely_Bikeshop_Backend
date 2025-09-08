import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  model: String,
  year: Number,
  newOrUsed: { type: String, enum: ['new', 'used'], default: 'new' },
  specs: String,
  isFeatured: { type: Boolean, default: false },
  pictures: [String], // array of image URLs
  bikeType: { type: String, enum: ['chinese', 'indian', 'electric', 'japanese'], default: 'road' }
});

export default mongoose.model('Bike', bikeSchema);

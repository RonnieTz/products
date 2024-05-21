import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const ProductSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const CategorySchema = new Schema({
  category: { type: String, required: true },
  user: { type: String, required: true },
});

// Create the model

export const User = models.User || model('User', userSchema);

export const Product = models.Product || model('Product', ProductSchema);

export const Category = models.Category || model('Category', CategorySchema);

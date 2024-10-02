import { Schema } from 'mongoose';

export const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  state: {
    type: Boolean,
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

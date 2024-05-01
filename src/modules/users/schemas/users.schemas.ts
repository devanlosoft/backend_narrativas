import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  rol: String,
  email: {
    type: String,
    unique: true,
  },
  username: String,
  password: String,
  id: Number,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

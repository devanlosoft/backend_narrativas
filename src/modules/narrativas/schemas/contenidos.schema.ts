import { Schema, Types } from 'mongoose';

export const ContentSchema = new Schema({
  title: {
    type: String,
    require: true,
  },

  state: {
    type: Boolean,
    required: true,
    default: true,
  },
  imagen: String,

  description: String,

  content_url: {
    type: String,
  },

  content_type: {
    type: String,
    enum: ['infografia', 'podcast', 'video'],
  },

  createAt: {
    type: Date,
    default: Date.now,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // Ajusta el nombre del modelo de categoría si es necesario
    validate: {
      validator: function (value) {
        return Types.ObjectId.isValid(value);
      },
      message: (props) => `${props.value} is not a valid ObjectId!`,
    },
  },
});

// modules/categories/category.model.ts
import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:      { type: String, required: true, maxlength: 100 },
  icon:      { type: String },
  color:     { type: String, match: /^#[0-9A-F]{6}$/i },  // hex
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export const Category = mongoose.model('Category', CategorySchema);

import mongoose, { Schema } from 'mongoose';

const GoalSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:      { type: String, required: true, maxlength: 200 },
  duration:  { type: String, required: true },
  frequency: { type: String, required: true },
  category:  { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  target:    { type: Number, required: true, min: 0 },
}, { timestamps: true });

export const Goal = mongoose.model('Goal', GoalSchema);

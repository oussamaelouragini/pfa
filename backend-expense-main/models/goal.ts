// modules/goals/goal.model.ts
import mongoose, { Schema } from 'mongoose';

const GoalSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title:        { type: String, required: true, maxlength: 200 },
  targetAmount: { type: Number, required: true, min: 0 },
  savedAmount:  { type: Number, default: 0, min: 0 },
  imageUrl:     { type: String },
  deadline:     { type: Date },
  status:       { type: String, enum: ['active','completed','paused'], default: 'active' },
  aiAnalysis:   { type: Schema.Types.Mixed, default: null },  // AI Insights payload
}, { timestamps: true });

// Virtual: progression percentage
GoalSchema.virtual('progress').get(function () {
  return ((this.savedAmount / this.targetAmount) * 100).toFixed(1);
});
GoalSchema.set('toJSON', { virtuals: true });

export const Goal = mongoose.model('Goal', GoalSchema);

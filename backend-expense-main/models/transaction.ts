// modules/transactions/transaction.model.ts
import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  categoryId:  { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  type:        { type: String, enum: ['expense', 'income'], required: true },
  amount:      { type: Number, required: true, min: 0 },
  note:        { type: String },
  date:        { type: Date, default: Date.now, index: true },
  isRecurring: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index replaces SQL: CREATE INDEX idx_transactions_user_date
TransactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model('Transaction', TransactionSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

const medicineSchema = new Schema(
  {
    medicineId: { type: String, unique: true, trim: true },
    medicineName: { type: String, required: true, trim: true },
    manufacturer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    batchNumber: { type: String, required: true, trim: true },
    expiryDate: { type: Date, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    supplier: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Available', 'Out of Stock', 'Expired'], default: 'Available' }
  },
  { timestamps: true }
);

medicineSchema.pre('save', async function generateMedicineId(next) {
  if (!this.isNew || this.medicineId) return next();

  const count = await this.constructor.countDocuments();
  this.medicineId = `MED-${String(count + 1).padStart(6, '0')}`;
  next();
});

medicineSchema.pre('save', function updateStatus(next) {
  const now = new Date();
  if (this.expiryDate && this.expiryDate < now) {
    this.status = 'Expired';
  } else if (this.stockQuantity <= 0) {
    this.status = 'Out of Stock';
  } else {
    this.status = 'Available';
  }
  next();
});

medicineSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
import mongoose from 'mongoose';

const { Schema } = mongoose;

const billSchema = new Schema(
  {
    billId: { type: String, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    consultationFee: { type: Number, default: 0, min: 0 },
    medicineCharges: { type: Number, default: 0, min: 0 },
    laboratoryCharges: { type: Number, default: 0, min: 0 },
    roomCharges: { type: Number, default: 0, min: 0 },
    miscellaneousCharges: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Insurance'], default: 'Cash' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    paymentDate: { type: Date, default: null },
    invoiceNumber: { type: String, unique: true, trim: true },
    remarks: { type: String, trim: true, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

billSchema.pre('validate', function calculateTotals(next) {
  const consultationFee = Number(this.consultationFee || 0);
  const medicineCharges = Number(this.medicineCharges || 0);
  const laboratoryCharges = Number(this.laboratoryCharges || 0);
  const roomCharges = Number(this.roomCharges || 0);
  const miscellaneousCharges = Number(this.miscellaneousCharges || 0);
  const discount = Number(this.discount || 0);

  const subtotal = consultationFee + medicineCharges + laboratoryCharges + roomCharges + miscellaneousCharges;
  const taxRate = Number(process.env.TAX_RATE || 0.1);
  const tax = Number((subtotal * taxRate).toFixed(2));
  const totalAmount = Number(Math.max(subtotal + tax - discount, 0).toFixed(2));

  this.subtotal = Number(subtotal.toFixed(2));
  this.tax = tax;
  this.totalAmount = totalAmount;
  next();
});

billSchema.pre('save', async function generateIdentifiers(next) {
  if (!this.isNew) return next();

  if (!this.billId) {
    const count = await this.constructor.countDocuments();
    this.billId = `BILL-${String(count + 1).padStart(6, '0')}`;
  }

  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
  }

  next();
});

billSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;

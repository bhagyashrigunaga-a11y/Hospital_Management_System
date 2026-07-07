import mongoose from 'mongoose';

const { Schema } = mongoose;

const medicineSchema = new Schema(
  {
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const prescriptionSchema = new Schema(
  {
    prescriptionId: { type: String, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    diagnosis: { type: String, required: true, trim: true },
    medicines: [medicineSchema],
    notes: { type: String, trim: true, default: '' },
    followUpDate: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Completed'], default: 'Active' }
  },
  { timestamps: true }
);

prescriptionSchema.pre('save', async function generatePrescriptionId(next) {
  if (!this.isNew || this.prescriptionId) return next();

  const count = await this.constructor.countDocuments();
  this.prescriptionId = `PRS-${String(count + 1).padStart(6, '0')}`;
  next();
});

prescriptionSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
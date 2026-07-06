import mongoose from 'mongoose';

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patientId: { type: String, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    dateOfBirth: { type: Date, required: true },
    bloodGroup: { type: String, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    address: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    medicalHistory: [{ type: String, trim: true }],
    allergies: [{ type: String, trim: true }],
    currentMedications: [{ type: String, trim: true }],
    assignedDoctor: { type: Schema.Types.ObjectId, ref: 'Doctor', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

patientSchema.pre('save', async function generatePatientId(next) {
  if (!this.isNew || this.patientId) return next();

  const count = await this.constructor.countDocuments();
  this.patientId = `PAT-${String(count + 1).padStart(6, '0')}`;
  next();
});

patientSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;

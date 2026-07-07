import mongoose from 'mongoose';

const { Schema } = mongoose;

const laboratorySchema = new Schema(
  {
    testId: { type: String, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    testName: { type: String, required: true, trim: true },
    testCategory: { type: String, required: true, trim: true },
    sampleType: { type: String, required: true, trim: true },
    testStatus: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    result: { type: String, trim: true, default: '' },
    normalRange: { type: String, trim: true, default: '' },
    reportFile: { type: String, trim: true, default: '' },
    requestedDate: { type: Date, default: Date.now },
    completedDate: { type: Date, default: null },
    remarks: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

laboratorySchema.pre('save', async function generateTestId(next) {
  if (!this.isNew || this.testId) return next();

  const count = await this.constructor.countDocuments();
  this.testId = `LAB-${String(count + 1).padStart(6, '0')}`;
  next();
});

laboratorySchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const LaboratoryTest = mongoose.model('LaboratoryTest', laboratorySchema);

export default LaboratoryTest;

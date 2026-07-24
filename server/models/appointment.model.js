import mongoose from 'mongoose';

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    appointmentId: { type: String, unique: true, trim: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    department: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true, trim: true },
    appointmentType: { type: String, enum: ['Online', 'Offline'], required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    notes: { type: String, trim: true, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

appointmentSchema.pre("save", async function (next) {
  if (!this.isNew || this.appointmentId) {
    return next();
  }

  const lastAppointment = await this.constructor
    .findOne({})
    .sort({ appointmentId: -1 });

  let nextNumber = 1;

  if (lastAppointment && lastAppointment.appointmentId) {
    nextNumber =
      Number(lastAppointment.appointmentId.replace("APT-", "")) + 1;
  }

  this.appointmentId = `APT-${String(nextNumber).padStart(6, "0")}`;

  next();
});

appointmentSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

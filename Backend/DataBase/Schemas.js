import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ScheduleSchema = new mongoose.Schema({
  time: String,
  reason: String,
});
const DoctorSchema = new mongoose.Schema({
  fullname: String,
  occupation: String,
  description: String,
  img: String,
  id: Number,
  schedule: {
    Monday: [ScheduleSchema],
    Tuesday: [ScheduleSchema],
    Wednesday: [ScheduleSchema],
    Thursday: [ScheduleSchema],
    Friday: [ScheduleSchema],
    Saturday: { type: [ScheduleSchema], default: undefined },
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    registered: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const AppointmentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    doctorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorname: {
      type: String,
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Doctor = mongoose.model("Doctor", DoctorSchema);
export const User = mongoose.model("User", UserSchema);
export const Appointment = mongoose.model("Appointment", AppointmentSchema);

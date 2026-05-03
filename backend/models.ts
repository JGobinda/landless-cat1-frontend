import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const applicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  currentStep: { type: Number, default: 0 },
  firstNameNp: String,
  firstNameEn: String,
  middleNameNp: String,
  middleNameEn: String,
  lastNameNp: String,
  lastNameEn: String,
  dobNp: String,
  dobEn: String,
  birthPlace: String,
  ccType: String,
  citizenshipNo: String,
  district: String,
  issuedDate: String,
  gender: String,
  maritalStatus: String,
  fatherStatus: String,
  education: String,
  profession: String,
  business: String,
  caste: String,
  religion: String,
  nidNo: String,
  currentHoldingCenter: String,
  
  // Contact info
  permPhone: String,
  permMobile: String,
  permState: String,
  permDistrict: String,
  permLocalLevel: String,
  permWard: String,
  permVillage: String,
  copyToTemp: Boolean,
  tempPhone: String,
  tempMobile: String,
  tempState: String,
  tempDistrict: String,
  tempLocalLevel: String,
  tempWard: String,
  tempVillage: String,

  // Family info
  fatherFirstNameNp: String,
  fatherFirstNameEn: String,
  fatherLastNameNp: String,
  fatherLastNameEn: String,
  fatherCitizenshipNo: String,
  fatherNidNo: String,
  fatherNationality: String,
  fatherPermState: String,
  fatherPermDistrict: String,
  fatherPermLocalLevel: String,
  fatherPermWard: String,
  fatherMirrorAddress: Boolean,
  fatherTempState: String,
  fatherTempDistrict: String,
  fatherTempLocalLevel: String,
  fatherTempWard: String,
  
  motherFirstNameNp: String,
  motherFirstNameEn: String,
  motherLastNameNp: String,
  motherLastNameEn: String,
  motherCitizenshipNo: String,
  motherNationality: String,
  motherPermState: String,
  motherPermDistrict: String,
  motherPermLocalLevel: String,
  motherPermWard: String,
  motherMirrorAddress: Boolean,
  motherTempState: String,
  motherTempDistrict: String,
  motherTempLocalLevel: String,
  motherTempWard: String,
  
  grandFatherFirstNameNp: String,
  grandFatherFirstNameEn: String,
  grandFatherLastNameNp: String,
  grandFatherLastNameEn: String,
  grandFatherCitizenshipNo: String,
  grandFatherNationality: String,
  grandFatherPermState: String,
  grandFatherPermDistrict: String,
  grandFatherPermLocalLevel: String,
  grandFatherPermWard: String,
  grandFatherMirrorAddress: Boolean,
  grandFatherTempState: String,
  grandFatherTempDistrict: String,
  grandFatherTempLocalLevel: String,
  grandFatherTempWard: String,

}, { timestamps: true });

applicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

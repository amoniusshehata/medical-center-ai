require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*'
}));
app.use(express.json());

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true, trim: true },
  from: { type: String, required: true },
  to: { type: String, required: true }
}, { _id: false });

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  address: {
    governorate: { type: String, default: '' },
    city: { type: String, default: '' },
    details: { type: String, default: '' }
  },
  workingHours: {
    days: { type: String, default: '' },
    from: { type: String, default: '' },
    to: { type: String, default: '' }
  },
  branches: [{
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' }
  }]
}, { timestamps: true });

const clinicSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  bookingAvailable: { type: Boolean, default: true },
  bookingInstructions: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  schedule: { type: [scheduleSchema], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'EGP' },
  duration: { type: Number, min: 0, default: null },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Center = mongoose.model('Center', centerSchema);
const Clinic = mongoose.model('Clinic', clinicSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Service = mongoose.model('Service', serviceSchema);
const FAQ = mongoose.model('FAQ', faqSchema);

app.get('/api/health', async (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/data', async (req, res) => {
  try {
    const center = await Center.findOne().lean();
    const centerId = center?._id;

    if (!centerId) {
      return res.json({ center: null, clinics: [], doctors: [], services: [], faqs: [] });
    }

    const [clinics, doctors, services, faqs] = await Promise.all([
      Clinic.find({ centerId }).lean(),
      Doctor.find({ centerId }).lean(),
      Service.find({ centerId }).lean(),
      FAQ.find({ centerId }).lean()
    ]);

    res.json({ center, clinics, doctors, services, faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.listen(PORT, () => {
  console.log(`Medical Center API running on port ${PORT}`);
});

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not configured. API started without database connection.');
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
}

connectDatabase().catch((error) => {
  console.error('MongoDB connection failed:', error.message);
});

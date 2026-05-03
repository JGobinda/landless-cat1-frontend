import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Application } from './src/lib/models';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://'))) {
  console.warn('⚠️ No valid MONGODB_URI found. The application will run without a database connection.');
  console.warn('Please set MONGODB_URI in your environment variables (e.g., MongoDB Atlas connection string).');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      if (err.message.includes('ECONNREFUSED')) {
        console.error('Hint: It looks like you are trying to connect to a local MongoDB that is not running.');
      }
    });
}

// API Routes
app.get('/api/applications', async (req, res) => {
  try {
    const { userId, citizenshipNo } = req.query;
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (citizenshipNo) filter.citizenshipNo = citizenshipNo;

    const applications = await Application.find(filter).sort({ updatedAt: -1 });
    res.json(applications.map(app => {
      const obj = app.toObject();
      return { ...obj, id: obj._id };
    }));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    const obj = application.toObject();
    res.json({ ...obj, id: obj._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    const obj = application.toObject();
    res.status(201).json({ ...obj, id: obj._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});

app.patch('/api/applications/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ error: 'Application not found' });
    const obj = application.toObject();
    res.json({ ...obj, id: obj._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

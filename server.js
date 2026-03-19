const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Firebase - commented out for now
const serviceAccount = require('./firebase-service-account.json');
 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: process.env.FIREBASE_DB_URL
 });

// Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test'
});

// Health Check
app.get('/', (req, res) => {
  res.json({ status: '✅ Outingo Backend Running!', version: '1.0.0' });
});

// GET Properties
app.get('/api/properties', (req, res) => {
  const properties = [
    { id: 1, name: 'Royal Palm Estate', type: 'Villa', location: 'Lonavala', price: 25000, maxGuests: 200, rating: 4.9 },
    { id: 2, name: 'Green Valley Farmhouse', type: 'Farmhouse', location: 'Mulshi', price: 18000, maxGuests: 150, rating: 4.8 },
    { id: 3, name: 'Sahyadri Mountain Resort', type: 'Resort', location: 'Mahabaleshwar', price: 45000, maxGuests: 500, rating: 5.0 },
    { id: 4, name: 'Splash Kingdom Park', type: 'Water Park', location: 'Khopoli', price: 850, maxGuests: 1000, rating: 4.7 },
    { id: 5, name: 'Secret Garden Venue', type: 'Hidden Party', location: 'Pune', price: 35000, maxGuests: 300, rating: 4.8 },
    { id: 6, name: 'Jungle Bloom Eco Camp', type: 'Eco Camp', location: 'Tamhini', price: 8500, maxGuests: 80, rating: 4.9 }
  ];
  res.json({ success: true, count: properties.length, data: properties });
});

// POST Booking
app.post('/api/bookings', (req, res) => {
  const { name, phone, propertyType } = req.body;
  if (!name || !phone || !propertyType) {
    return res.status(400).json({ success: false, error: 'Name, phone & type required' });
  }
  console.log(`📋 New Booking: ${name} | ${phone} | ${propertyType}`);
  res.json({ success: true, bookingId: 'BK' + Date.now(), message: 'Booking received!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌿 OUTINGO Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`✅ Server ready!\n`);
});
// Seed Sample Data
app.post('/api/seed', async (req, res) => {
  try {
    const db = admin.firestore();
    const sampleProperties = [
      { name: 'Royal Palm Estate', type: 'Villa', location: 'Lonavala', price: 25000, maxGuests: 200, rating: 4.9 },
      { name: 'Green Valley Farmhouse', type: 'Farmhouse', location: 'Mulshi', price: 18000, maxGuests: 150, rating: 4.8 },
      { name: 'Sahyadri Mountain Resort', type: 'Resort', location: 'Mahabaleshwar', price: 45000, maxGuests: 500, rating: 5.0 },
      { name: 'Splash Kingdom Park', type: 'Water Park', location: 'Khopoli', price: 850, maxGuests: 1000, rating: 4.7 },
      { name: 'Secret Garden Venue', type: 'Hidden Party', location: 'Pune', price: 35000, maxGuests: 300, rating: 4.8 },
      { name: 'Jungle Bloom Eco Camp', type: 'Eco Camp', location: 'Tamhini', price: 8500, maxGuests: 80, rating: 4.9 }
    ];
    for (const prop of sampleProperties) {
      await db.collection('properties').add(prop);
    }
    res.json({ success: true, message: '6 properties added!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ShippingPrice from './models.js';  // Correct path to the model


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
 await mongoose.connect('mongodb://localhost:27017/shipping',)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route for calculating shipping cost
app.post('/calculate-shipping', async (req, res) => {
  const { weight, distance, cargoType } = req.body;

  if (!weight || !distance || !cargoType) {
    return res.status(400).json({ message: 'Weight, distance, and cargoType are required' });
  }

  try {
  
    const pricing = await ShippingPrice.findOne({
      weight: { $lte: weight },     
      distance: { $lte: distance }, 
      cargoType: cargoType
    }).sort({ weight: -1, distance: -1 }); 

    if (!pricing) {
      return res.status(404).json({ message: 'Price not found' });
    }

    res.json({ shippingCost: pricing.price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for adding new shipping pricing
app.post('/add-pricing', async (req, res) => {
  const { weight, distance, cargoType, price } = req.body;

  // Input validation
  if (!weight || !distance || !cargoType || !price) {
    return res.status(400).json({ message: 'weight, distance, cargoType, and price are required' });
  }

  try {
    // Create a new shipping pricing record
    const newPricing = new ShippingPrice({
      weight,
      distance,
      cargoType,
      price
    });

    // Save the new pricing record to the database
    await newPricing.save();

    res.status(201).json({ message: 'Shipping price added successfully', pricing: newPricing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding shipping pricie' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Shipping API running on port ${port}`);
});

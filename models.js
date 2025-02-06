const mongoose = require('mongoose');

const shippingPricingSchema = new mongoose.Schema({
  weight: { type: Number, required: true }, 
  distance: { type: Number, required: true }, 
  cargoType: { type: String, required: true }, 
  price: { type: Number, required: true },   
});

const ShippingPricing = mongoose.model('ShippingPricing', shippingPricingSchema);

module.exports = ShippingPricing;

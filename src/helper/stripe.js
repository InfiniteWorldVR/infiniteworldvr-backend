import dotenv from "dotenv";

dotenv.config();

import stripe from "stripe";
const stripeApi = stripe(process.env.STRIPE_SECRET_KEY);


export default stripeApi;

// Path: src/routes/productRoute.js

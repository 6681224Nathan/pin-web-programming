// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/products', productsRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

app.get('/', (req, res) => res.send('EGCI427 API with MongoDB'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

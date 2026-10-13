const express = require('express');
const app = express();
app.use(express.json());

let products = [];
let nextId = 1;

// Returns an error message, or null if the data is fine.
// isNew = true  -> name, price, category are required (POST)
// isNew = false -> only check the fields that were sent (PATCH)
function checkProduct(data, isNew) {
  const { name, price, category, stock } = data;

  if (isNew || name !== undefined) {
    if (!name || typeof name !== 'string') return 'name is required';
  }
  if (isNew || price !== undefined) {
    if (typeof price !== 'number' || price <= 0) return 'price must be > 0';
  }
  if (isNew || category !== undefined) {
    if (!category || typeof category !== 'string') return 'category is required';
  }
  if (stock !== undefined) {
    if (typeof stock !== 'number' || stock < 0) return 'stock must be >= 0';
  }
  return null;
}

// GET /products  and  GET /products?category=X
app.get('/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : products;

  res.json({ success: true, count: result.length, data: result });
});

// GET /products/:id
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  res.json({ success: true, data: product });
});

// POST /products
app.post('/products', (req, res) => {
  const { name, price, category, stock = 0 } = req.body;

  const error = checkProduct({ name, price, category, stock }, true);
  if (error) return res.status(400).json({ error });

  const product = {
    id: nextId++,
    name,
    price,
    category,
    stock,
    createdAt: new Date().toISOString()
  };

  products.push(product);
  res.status(201).json({ success: true, data: product });
});

// PATCH /products/:id
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const error = checkProduct(req.body, false);
  if (error) return res.status(400).json({ error });

  const { name, price, category, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (stock !== undefined) product.stock = stock;

  res.json({ success: true, data: product });
});

// DELETE /products/:id
app.delete('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  products = products.filter(p => p.id !== product.id);
  res.json({ success: true, data: product });
});

app.listen(3000, () => console.log('Products API on :3000'));

const express = require('express');
const app = express();
const fs = require('fs').promises;
app.use(express.json());

async function readFile(){
  const productsRaw = await fs.readFile('products.json', 'utf8');
  const products = JSON.parse(productsRaw);
  return products;
}


// ── HTTP METHOD ROUTES ──────────────────────────
app.get('/products', async (req, res) => {
  const read = await readFile();
  // GET /products — return all products
  res.json({ read });
});

app.get('/products/:id', async (req, res) => {
  const read = await readFile();
  const id = Number(req.params.id)
  for(i=0; i<read.length; i++){
    if(read[i].id === id){
      res.json({ read: read[i] });
      return;
    }
  }
  // GET /products/:id — return specific products by id
});

app.post('/products', async (req, res) => {
  // POST /users — create a user
  const {id, name, price, category, stock, createdAt} = req.body;   // from JSON body
  const productWrite = await fs.writeFile('products.json', {id, name, price, category, stock, createdAt});

  res.status(201).json({ id, name, email });
});





//-----------------//

app.post('/users', (req, res) => {
  // POST /users — create a user
  const { id, name, email } = req.body;   // from JSON body
  users.push({ id, name, email });        // add to array
  res.status(201).json({ id, name, email });
});

app.put('/users/:id', (req, res) => {
  // PUT /users/42 — replace user 42
  const { id } = req.params
  users = users.map(user => user.id === id ? { id, ...req.body } : user);
  res.json({ updated: true, users });
});

app.patch('/users/:id', (req, res) => {
  // PATCH /users/42 — update fields of user 42
  res.json({ updated: true, id: req.params.id });
});

app.delete('/users/:id', (req, res) => {
  // DELETE /users/42 — remove user 42
  users = users.filter(user=> user.id !== req.params.id);
  res.json({ deleted: true, id: req.params.id });
});

app.listen(3000);


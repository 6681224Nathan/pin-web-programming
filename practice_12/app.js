
const express = require('express');
const app = express();
app.use(express.json());

var users = [{
            "id": "1",
            "name": "Bob",
            "email": "Bob@mail.test"
        },
        {
            "id": "2",
            "name": "Tom",
            "email": "Tom@mail.test"
        },
        {
            "id": "3",
            "name": "Sue",
            "email": "Sue@mail.test"
        }];

// ── HTTP METHOD ROUTES ──────────────────────────
app.get('/users', (req, res) => {
  // GET /users — return all users
  res.json({ users: users });
});

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
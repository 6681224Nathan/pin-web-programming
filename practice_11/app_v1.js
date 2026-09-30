// Version 1 (starter): each route just replies, nothing is stored.
const express = require('express');
const app = express();
app.use(express.json());

// ── HTTP METHOD ROUTES ──────────────────────────
app.get('/users', (req, res) => {
    // GET /users — return all users
    res.json({ users: [] });
});

app.post('/users', (req, res) => {
    // POST /users — create a user
    const { name, email } = req.body; // from JSON body
    res.status(201).json({ id: Date.now(), name, email });
});

app.put('/users/:id', (req, res) => {
    // PUT /users/42 — replace user 42
    const { id } = req.params;
    res.json({ id, ...req.body });
});

app.patch('/users/:id', (req, res) => {
    // PATCH /users/42 — update fields of user 42
    res.json({ updated: true, id: req.params.id });
});

app.delete('/users/:id', (req, res) => {
    // DELETE /users/42 — remove user 42
    res.json({ deleted: true, id: req.params.id });
});

app.listen(3000);

const express = require('express');
const app = express();
app.use(express.json());

var users = [];

// ── HTTP METHOD ROUTES ──────────────────────────
app.get('/users', (req, res) => {
    // GET /users — return all users
    //res.json({ users: [] });
    res.json({ users: users });
});

app.post('/users', (req, res) => {
    // POST /users — create a user
    const { id, name, email } = req.body; // from JSON body
    users.push({ id, name, email });
    res.status(201).json({ id, name, email });
});

app.put('/users/:id', (req, res) => {
    // PUT /users/42 — replace user 42
    const { id } = req.params;
    users = users.map(user => user.id === id ? { id, ...req.body } : user);
    res.json({ updated: true, users });
    //res.json({ id, ...req.body });
});

app.patch('/users/:id', (req, res) => {
    // PATCH /users/42 — update fields of user 42
    const { id } = req.params;
    users = users.map(user => user.id === id ? { ...user, ...req.body } : user);
    res.json({ updated: true, users});
});

app.delete('/users/:id', (req, res) => {
    // DELETE /users/42 — remove user 42
    users = users.filter(user => user.id !== req.params.id);
    res.json({ deleted: true, id: req.params.id });
});

app.listen(3000);

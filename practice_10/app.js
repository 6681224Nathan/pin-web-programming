// users-api.js — Complete CRUD REST API
const express = require('express');
const app = express();
app.use(express.json());

// In-memory data store
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
];
let nextId = 3;

// Helper: find user by id
const findUser = id => users.find(u => u.id === parseInt(id));

// GET /users — list all
app.get('/users', (req, res) => {
    res.json({ success: true, count: users.length, data: users });
});

// GET /users/:id — get one
app.get('/users/:id', (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: user });
});

// POST /users — create
app.post('/users', (req, res) => {
    const { name, email, role = 'user' } = req.body;
    if (!name || !email)
        return res.status(400).json({ error: 'name and email required' });
    const user = { id: nextId++, name, email, role };
    users.push(user);
    res.status(201).json({ success: true, data: user });
});

// PUT /users/:id — full replace
app.put('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const { name, email, role } = req.body;
    if (!name || !email)
        return res.status(400).json({ error: 'name and email required' });
    users[idx] = { id: users[idx].id, name, email, role: role || 'user' };
    res.json({ success: true, data: users[idx] });
});

// PATCH /users/:id — partial update
app.patch('/users/:id', (req, res) => {
    const user = findUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    Object.assign(user, req.body); // merge changes
    res.json({ success: true, data: user });
});

// DELETE /users/:id
app.delete('/users/:id', (req, res) => {
    const idx = users.findIndex(u => u.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = users.splice(idx, 1)[0];
    res.json({ success: true, deleted });
});

// 404 handler — must be LAST
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => console.log('API running on :3000'));

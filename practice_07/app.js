//Middleware Examples
const express = require('express');
const app = express();
// ── GLOBAL MIDDLEWARE (runs for every request) ──
// 1. Parse JSON bodies
app.use(express.json());
// 2. Logger middleware
app.use((req, res, next) => {
const now = new Date().toISOString();
console.log(`[${now}] ${req.method} ${req.url}`);
next(); // MUST call next() or request hangs!
});
// 3. CORS middleware
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods',
'GET, POST, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers',
'Content-Type, Authorization');
next();
});
//Middleware Pipeline Flow
// ── PATH-SPECIFIC MIDDLEWARE ────────────────────
// Only runs for /admin/* routes
app.use('/admin', (req, res, next) => {
const token = req.headers['authorization'];
if (!token || token !== 'Bearer secret123') {
return res.status(401).json({ error: 'Unauthorized' });
}
next(); // authorized — continue
});
app.get('/admin/dashboard', (req, res) => {
res.json({ data: 'Secret dashboard' });
});
app.listen(3000);
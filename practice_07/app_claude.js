// =====================================================================
//  practice_07 — Middleware examples (commented version of app.js)
//
//  Run:   node app_claude.js
//  Test:  see "HOW TO TEST" at the very bottom of this file.
//
//  Middleware = a function that runs BEFORE your routes, like a guard
//  at the door. Every request walks past the guards IN THE ORDER THEY
//  ARE WRITTEN, top to bottom, until one of them sends a response.
//
//      request ──► express.json() ──► logger ──► CORS ──► /admin guard ──► route
//                                                              │
//                                                   no password? send 401, stop
// =====================================================================

const express = require('express');
const app = express();


// ── GLOBAL MIDDLEWARE (runs for EVERY request) ───────────────────────
// app.use(fn) with no path = "run this for every visit, whatever the URL".


// 1. Parse JSON bodies
//
// Some requests carry DATA along with them, called the "body", e.g. a
// signup form sending { "username": "bob", "password": "1111" }.
// That data arrives as plain TEXT. express.json() is a ready-made guard
// that turns that text into a real object (JSON.parse, done for you)
// and puts it in req.body, so later routes can use req.body.username.
//
// Nothing in this file uses req.body yet. It's set up for POST routes
// later. A browser address bar can't send a body, which is one reason
// you'll need Postman.
app.use(express.json());


// 2. Logger middleware
//
// Prints one line in the terminal for every request, e.g.
//     [2026-09-30T03:26:35.986Z] GET /admin/dashboard
//
//   new Date()      → the current date and time
//   .toISOString()  → written in a standard format (the Z means UTC time,
//                      which is 7 hours behind Thailand)
//   req.method      → the KIND of request: GET (fetch something),
//                      POST (send new data), PUT/PATCH (change), DELETE
//   req.url         → the path that was asked for
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);

    // next() = "I'm done, pass the visitor on to the next guard / route".
    // Without it, the request is stuck here and the browser loads forever.
    next(); // MUST call next() or request hangs!
});


// 3. CORS middleware
//
// Browsers have a safety rule: a web page from one address is NOT allowed
// to read data from a DIFFERENT address, unless that server says it's OK.
// e.g. a Vue app on localhost:5173 asking this API on localhost:3000.
// That permission is called CORS (Cross-Origin Resource Sharing).
//
// These lines add HEADERS to every response. Headers are small labelled
// notes attached to a request or response (like Content-Type, which you've
// seen before). These three tell the browser:
//
//   Allow-Origin  '*'                       → any website may use this API
//   Allow-Methods 'GET, POST, ...'          → these kinds of request are allowed
//   Allow-Headers 'Content-Type, Authorization' → these headers may be sent in
//
// It doesn't change anything you'll see in Postman or curl. It only matters
// when a web page in a browser calls this API.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers',
        'Content-Type, Authorization');
    next();   // pass it on
});


// ── PATH-SPECIFIC MIDDLEWARE ─────────────────────────────────────────
// app.use('/admin', fn) = only run this guard for URLs that START with
// /admin, e.g. /admin/dashboard. A visit to /hello skips it entirely.
app.use('/admin', (req, res, next) => {

    // Read the "authorization" header from the REQUEST. This is where a
    // visitor puts their password / token. A normal browser visit doesn't
    // send one, so this is undefined, which is why the browser gets 401.
    const token = req.headers['authorization'];

    // Turn them away if:
    //   !token                          → no password was sent at all, OR
    //   token !== 'Bearer secret123'    → a password was sent, but it's wrong
    //
    // "Bearer" is just the standard word that goes in front of a token:
    // "the bearer (holder) of this token is allowed in".
    if (!token || token !== 'Bearer secret123') {

        // 401 = "Unauthorized": you need to prove who you are.
        // res.status(401).json(...) sets the code and sends a JSON reply.
        //
        // Why "return" in front? It does two jobs in one line:
        //   1. sends the reply
        //   2. STOPS this function, so it never reaches next() below.
        // Same as writing:
        //     res.status(401).json({ error: 'Unauthorized' });
        //     return;
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Only reached if the password was right: let them through.
    // (In the original file, this line was one line too low, OUTSIDE this
    //  function, where `next` doesn't exist → "ReferenceError: next is not
    //  defined" and the server crashed on startup.)
    next(); // authorized — continue
});


// ── ROUTES ───────────────────────────────────────────────────────────
// Only visitors who got past ALL the guards above reach this.
// res.json(...) sends an object as JSON (Lesson 10 of your js-course).
app.get('/admin/dashboard', (req, res) => {
    res.json({ data: 'Secret dashboard' });
});


// Switch the server on at port 3000.
app.listen(3000);


// =====================================================================
//  HOW TO TEST
//
//  1. Start the server:              node app_claude.js
//
//  2. Browser → http://localhost:3000/admin/dashboard
//        {"error":"Unauthorized"}      ← correct! a browser sends no password
//
//  3. Postman:  GET  http://localhost:3000/admin/dashboard
//        Headers tab →  Key: Authorization   Value: Bearer secret123
//        Send  →  {"data":"Secret dashboard"}
//
//     Or in a second terminal (same thing, no app needed):
//        curl -H "Authorization: Bearer secret123" localhost:3000/admin/dashboard
//
//  4. Watch the first terminal: the logger prints a line for every request,
//     INCLUDING the rejected ones, because the logger runs before the guard.
// =====================================================================

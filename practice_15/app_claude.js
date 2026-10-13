// =====================================================================
//  practice_15 — a form (POST) that saves every submission to output.json
//  (commented version of app.js)
//
//  Run:   cd practice_15
//         node app_claude.js
//  Then:  open http://localhost:8081/showForm in your browser
//
//  The flow:
//    1. Browser asks   GET  /showForm  → the server sends the HTML form
//    2. You fill it in and press Submit
//    3. Browser sends  POST /showData  → the server saves it and replies
//    4. The page you land on (/showData) shows everything saved so far
//
//  What I ASSUMED from the assignment text (check these with your professor):
//    • result = input1 + input2. The example fits: Tom's boxes were 2 and 3,
//      and his result was 5.
//    • The page shows the WHOLE saved list, like the "1st / 2nd submit" examples.
//    • Names are saved exactly as typed ("tom" stays "tom"). The example shows
//      "Tom", so if she wants a capital letter, see "TRY IT" at the bottom.
//    • The examples in the assignment have typos (a stray quote after the 3,
//      missing commas), so the file is written as proper JSON: a list
//      [ {...}, {...} ] with result as a number.
// =====================================================================

const express = require('express');

// Plain 'fs', NOT require('fs').promises like practice_08/09.
// This gives us the "Sync" versions (readFileSync, writeFileSync), which
// WAIT until the job is done. Why I chose them here:
//   • Simpler to read: no async / await / extra try-catch.
//   • Safer for this job: we READ the file, ADD to the list, then WRITE it
//     back. With the waiting versions, Node finishes all three steps for one
//     visitor before starting the next one. With the async versions, two
//     people pressing Submit at the same moment could both read the OLD list,
//     and one entry would be lost.
// (The cost: the server pauses for a split second while the file is read.
//  For one small file, that's nothing.)
const fs = require('fs');

const app = express();

// The browser sends form data as plain text like  fname=Tom&lname=Cat&input1=2&input2=3
// This line teaches Express to unpack that text into an object, req.body.
// Without it, req.body would be empty. (Same line as practice_14's post.js.)
app.use(express.urlencoded({ extended: true }));

// Where the saved list lives. __dirname = "the folder this file is in", so
// output.json always lands next to app.js, no matter which folder your terminal
// is in. (See Lesson 08 in your js-course.)
const outputFile = __dirname + '/output.json';


// ── Step 1: show the form ───────────────────────────────────────────
// Visiting /showForm just sends back the HTML file. Look inside showForm.html:
//    <form action="/showData" method="post">
//      action="/showData"  → where the browser sends the data when you press Submit
//      method="post"       → send it hidden in the request (POST), not in the address
//    <input name="fname"> → the name= on each box becomes the KEY in req.body,
//                           so the four boxes give req.body.fname, .lname,
//                           .input1 and .input2. If a name= is misspelled, that
//                           value never arrives.
//    required            → the browser refuses to submit while a box is empty
//    type="number"       → the box only accepts numbers (whole numbers by default)
app.get('/showForm', (req, res) => {
    res.sendFile(__dirname + '/showForm.html');
});


// ── Step 2: receive the form, save it, show everything ─────────────
app.post('/showData', (req, res) => {
    try {

        // Pull the four values out of req.body (destructuring, Lesson 04).
        // "|| {}" = "if there's no body at all, use an empty object". Without it,
        // a request with no data would crash on this line instead of being
        // turned away politely below.
        const { fname, lname, input1, input2 } = req.body || {};

        // ⚠️ THE CATCH OF THIS ASSIGNMENT: everything from a form arrives as TEXT.
        // input1 is the text '2', not the number 2. And text + text glues together:
        //     '2' + '3'  →  '23'      (wrong!)
        //     Number('2') + Number('3')  →  5     (right)
        // So convert each box to a number BEFORE adding.
        const result = Number(input1) + Number(input2);

        // Turn the visitor away (400 = "bad request: you sent something invalid") if:
        //   • any box is missing or empty (the form's "required" stops this in a
        //     browser, but Postman or curl can still send empty values), OR
        //   • input1 / input2 weren't numbers, e.g. 'abc'. Number('abc') is NaN
        //     ("Not a Number"), and NaN + anything is NaN, so isNaN(result) catches it.
        // Why bother? JSON can't hold NaN. It would be saved as null and quietly
        // corrupt your output.json.
        // The "return" stops the function here, so nothing below runs.
        if (!fname || !lname || !input1 || !input2 || isNaN(result)) {
            return res.status(400).send('Please fill in every box, with numbers for input 1 and 2.');
        }

        // Load what's been saved so far.
        // First time ever: output.json doesn't exist yet, so start from an empty list.
        // existsSync = "does this file exist?" (true / false).
        let records = [];
        if (fs.existsSync(outputFile)) {
            // readFileSync gives TEXT ('utf8' = turn the bytes into letters),
            // and JSON.parse turns that text back into a real array. (Lesson 04.)
            records = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        }

        // Add this submission to the end of the list.
        // { fname, lname, result } is shorthand for { fname: fname, lname: lname, result: result }.
        // This is what makes it ACCUMULATE: load the old list, push the new one on,
        // save the whole list again. (Writing without loading first would
        // replace the file each time, leaving just one entry.)
        records.push({ fname, lname, result });

        // Save the whole list back. JSON.stringify turns the array into text, and
        // (records, null, 2) makes it neat, with 2-space indents, so output.json
        // is readable when you open it. The file is saved on disk, so it also
        // survives restarting the server.
        fs.writeFileSync(outputFile, JSON.stringify(records, null, 2));

        // Reply with the full list. The browser is now sitting at
        // localhost:8081/showData, which is the "redirect" in the assignment.
        // res.json sends the array as JSON for the browser to display.
        res.json(records);

    } catch (err) {
        // Anything unexpected, e.g. someone hand-edited output.json and broke it,
        // so JSON.parse failed. Without this, the visitor would get a long error page.
        console.error('Error:', err.message);
        res.status(500).send('Something went wrong saving your data.');
    }
});


// Switch the server on at port 8081 and print the address to open.
app.listen(8081, () => {
    console.log('Server is running: open http://localhost:8081/showForm');
});


// =====================================================================
//  TRY IT
//
//  1. Submit twice, then open output.json in VS Code. You'll see both entries.
//     Stop the server (Ctrl+C), start it again, submit once more: all THREE are
//     still there, because the list lives in the file, not in memory.
//
//  2. Press Refresh on the /showData page. The browser asks "resend form?".
//     Say yes and you get a DUPLICATE entry, because refreshing repeats the POST.
//     (The usual fix is to POST, then redirect to a separate GET page. Ask if
//     you want that version.)
//
//  3. Capitalise names ("tom" → "Tom"). Replace the push line with:
//        const cap = s => s[0].toUpperCase() + s.slice(1).toLowerCase();
//        records.push({ fname: cap(fname), lname: cap(lname), result });
//
//  4. Delete the Number(...) calls and submit 2 and 3. result becomes '23'.
// =====================================================================

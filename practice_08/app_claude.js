// =====================================================================
//  practice_08 — Reading 3 files at once with async/await
//  (commented version of app.js)
//
//  Run from INSIDE this folder:
//      cd practice_08
//      node app_claude.js
//
//  What it does: reads users.json, posts.json and comments.json AT THE
//  SAME TIME, turns each into real data, and prints all three.
// =====================================================================


// "GENERATION 3" — your professor's slides show three generations of
// handling slow jobs (Lesson 07 of your js-course):
//
//   Generation 1: callbacks      fs.readFile('a.json', function(err, data) { ... })
//   Generation 2: Promises       readFile('a.json').then(data => ...)
//   Generation 3: async/await    const data = await readFile('a.json');   ← this file
//
// All three do the same job. Generation 3 is the easiest to read.
// GENERATION 3: async/await (ES2017) — modern best practice


// require('fs')          → the normal file toolbox. Its readFile uses CALLBACKS.
// require('fs').promises → the SAME toolbox, but its readFile returns a
//                          PROMISE (a buzzer) instead. That's what lets us
//                          use `await` on it below.
//
// So here, fs.readFile('users.json', 'utf8') hands back a buzzer that
// "buzzes" with the file's text once it's been read.
const fs = require('fs').promises;


// `async` = this function is allowed to use `await` inside.
// (And, like every async function, calling it gives back a Promise.)
async function loadAllData() {

    // try { ... } catch { ... }
    // Run the code in `try`. If ANYTHING in it fails (a file is missing,
    // a file isn't valid JSON...), jump straight to `catch` instead of
    // crashing the whole program.
    try {

        // ── The key line, read from the INSIDE out ──────────────────
        //
        // ① Start reading all three files. Each fs.readFile(...) hands
        //    back a buzzer immediately; none of them waits for the others.
        //    So all three reads are running AT THE SAME TIME.
        //
        // ② Promise.all([buzzer1, buzzer2, buzzer3])
        //    = ONE big buzzer that only goes off when ALL THREE are done.
        //    It gives back their results as an array, IN THE SAME ORDER
        //    you listed them: [users text, posts text, comments text].
        //    (If even one fails, the whole thing fails → jumps to catch.)
        //
        // ③ await = pause here until that big buzzer goes off, then take
        //    out the array of three texts.
        //
        // ④ const [usersRaw, postsRaw, commentsRaw] = ...
        //    ARRAY DESTRUCTURING (Lesson 04): unpack the array by position.
        //      1st item → usersRaw
        //      2nd item → postsRaw
        //      3rd item → commentsRaw
        //
        // "Raw" in the names means: still just TEXT, not usable data yet.
        const [usersRaw, postsRaw, commentsRaw] = await Promise.all([
            fs.readFile('users.json', 'utf8'),    // run all three
            fs.readFile('posts.json', 'utf8'),    // in parallel!
            fs.readFile('comments.json', 'utf8'),
        ]);
        //
        // WHY Promise.all? Compare:
        //
        //   One at a time (each waits for the one before):
        //       const usersRaw    = await fs.readFile('users.json', 'utf8');
        //       const postsRaw    = await fs.readFile('posts.json', 'utf8');
        //       const commentsRaw = await fs.readFile('comments.json', 'utf8');
        //
        //   All at once (this file): the three files don't depend on each
        //   other, so there's no reason to wait. Total time ≈ the slowest
        //   single file, instead of all three added together.
        //
        // 'users.json' with no folder in front means "in the folder the
        // TERMINAL is in", not "next to this file". That's why you must
        // `cd practice_08` first. (__dirname + '/users.json' would work
        // from anywhere, see Lesson 08.)


        // Turn each text into real data you can use (Lesson 04).
        // After this, users[0].name is 'Alex Morgan', etc.
        const users = JSON.parse(usersRaw);
        const posts = JSON.parse(postsRaw);
        const comments = JSON.parse(commentsRaw);


        // { users, posts, comments } is ES6 SHORTHAND for:
        //     { users: users, posts: posts, comments: comments }
        // When the key and the variable have the same name, you can
        // write it once. Printing it as one object shows each list
        // under a label, so you can tell which is which.
        console.log({ users, posts, comments });

    } catch (err) {
        // Only runs if something in `try` failed.
        // err.message is the short, human-readable part of the error,
        // e.g. "ENOENT: no such file or directory, open 'users.json'"
        // (ENOENT = "Error: NO ENTry", i.e. file not found).
        console.error('Error:', err.message); // clean error handling
    }
}


// Everything above only DESCRIBES the function. This line actually
// RUNS it. Without it, the program would do nothing.
loadAllData(); // reads all 3 files simultaneously!


// =====================================================================
//  TRY IT
//
//  1. Rename posts.json to posts2.json, then run again.
//     → "Error: ENOENT ..." : the catch block caught it. No crash.
//     (Rename it back afterwards!)
//
//  2. Swap the order of two lines inside Promise.all([...]) but NOT the
//     names in [usersRaw, postsRaw, commentsRaw]. What gets printed as
//     "users"? (Order matters: results come back in the order listed.)
//
//  3. Replace the console.log with:
//        console.log(users[0].name, 'wrote:', posts[0].title);
//     → Alex Morgan wrote: Getting started with Node.js
// =====================================================================

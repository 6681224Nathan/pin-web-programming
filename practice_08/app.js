// GENERATION 3: async/await (ES2017) — modern best practice
const fs = require('fs').promises;

async function loadAllData() {
    try {
        const [usersRaw, postsRaw, commentsRaw] = await Promise.all([
            fs.readFile('users.json', 'utf8'),    // run all three
            fs.readFile('posts.json', 'utf8'),    // in parallel!
            fs.readFile('comments.json', 'utf8'),
        ]);
        const users = JSON.parse(usersRaw);
        const posts = JSON.parse(postsRaw);
        const comments = JSON.parse(commentsRaw);
        console.log({ users, posts, comments });
    } catch (err) {
        console.error('Error:', err.message);     // clean error handling
    }
}

loadAllData(); // reads all 3 files simultaneously!

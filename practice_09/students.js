// students.json (given file):
[
{"id":1,"name":"Alice","score":88,"grade":"A"},
{"id":2,"name":"Bob","score":72,"grade":"B"},
{"id":3,"name":"Charlie","score":55,"grade":"C"},
{"id":4,"name":"Dana","score":91,"grade":"A"},
{"id":5,"name":"Eve", "score":65,"grade":"B"}
]
// Task: Create report.js that:
// 1. Reads students.json using async/await
// 2. Calculates: count, average, highest,lowest score
// 3. Filters students with grade 'A'
// 4. Writes a summary to report.txt
// 5. Handles errors with try/catch
// Expected report.txt:
// === Student Report ===
// Total: 5 students
// Average score: 74.2
// Highest: Dana (91)
// Lowest: Charlie (55)
// Grade A students: Alice, Dana
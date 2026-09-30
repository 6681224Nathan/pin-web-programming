// GENERATION 3: async/await (ES2017) — modern best practice
const fs = require('fs').promises;

async function loadAllData() {
    try {

        const studentsRaw = await fs.readFile('students.json', 'utf8');
        const students = JSON.parse(studentsRaw);

        let count = students.length;
        let average = 0;
        let total = 0;
        let highestScoreStudent = students[0];
        let lowestScoreStudent = students[0];
        let studentsWithGradeA = [];

        for(i=0;  i< students.length; i++)
        {
            total += students[i].score;
        }
        average = total/count;
        //total and average score

        for(i=0;  i< students.length; i++)
        {
            if(students[i].score<=lowestScoreStudent.score){
                lowestScoreStudent = students[i];
            }
        }
        //lowest score

        for(i=0;  i< students.length; i++)
        {
            if(students[i].score>=highestScoreStudent.score){
                highestScoreStudent = students[i];
            }
        }
        //highest score

        for(i=0;  i<students.length; i++)
        {
            if(students[i].grade === 'A'){
                studentsWithGradeA.push(students[i]);
            }
        }
        //student with grade A

        let text = '=== Student Report ===\n';
        text += `Total: ${count} students\n`;
        text += `Average score: ${Number(average.toFixed(2))} \n`;
        text += `Highest: ${highestScoreStudent.name} (${highestScoreStudent.score})\n`;
        text += `Lowest: ${lowestScoreStudent.name} (${lowestScoreStudent.score})\n`;
        text += `Grade A students: `
        for(i=0; i<studentsWithGradeA.length; i++){
            text += `${studentsWithGradeA[i].name}, `
        }


        // === Student Report ===
        // Total: 5 students
        // Average score: 74.2
        // Highest: Dana (91)
        // Lowest: Charlie (55)
        // Grade A students: Alice, Dana


        const reportCard = await fs.writeFile('report.txt', text);


        console.log({ students });


    } catch (err) {
        console.error('Error:', err.message);     // clean error handling
    }
}

loadAllData(); // reads all 3 files simultaneously!

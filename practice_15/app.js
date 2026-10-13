const express = require('express');

const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));

const outputFile = __dirname + '/output.json';

app.get('/showForm', (req, res) => {
    res.sendFile(__dirname + '/showForm.html');
});

app.post('/showData', (req, res) => {
    try {

        const { fname, lname, input1, input2 } = req.body || {};

        const result = Number(input1) + Number(input2);

        if (!fname || !lname || !input1 || !input2 || isNaN(result)) {
            return res.status(400).send('Please fill in every box, with numbers for input 1 and 2.');
        }

        let records = [];
        if (fs.existsSync(outputFile)) {
            records = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        }

        records.push({ fname, lname, result });

        fs.writeFileSync(outputFile, JSON.stringify(records, null, 2));

        res.json(records);

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Something went wrong saving your data.');
    }
});

app.listen(8081, () => {
    console.log('Server is running: open http://localhost:8081/showForm');
});

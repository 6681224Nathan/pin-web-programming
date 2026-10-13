//POST Method
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/showForm', (req, res) => {
    res.sendFile(__dirname + '/showForm.html');
});

app.post('/showData', (req, res) => {
    //const { fname, lname } = req.query;
    data = {
        fname: req.body.fname,
        lname: req.body.lname
    }
    res.send(JSON.stringify(data));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//

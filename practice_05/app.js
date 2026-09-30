var express = require('express');
var temp = require('./tempConverter.js');

console.log('100°C = ' + temp.celsiusToFahrenheit(100).toFixed(2) + '°F');
console.log('100°C = ' + temp.celsiusToKelvin(100).toFixed(2) + 'K');
console.log('212°F = ' + temp.fahrenheitToCelsius(212).toFixed(2) + '°C');

var app = express();

function sendResult(res, value, resultType, convert) {
    var number = Number(value);
    if (isNaN(number)) {
        res.status(400).json({ error: value + ' is not a number' });
        return;
    }
    res.json({
        result_type: resultType,
        result: Number(convert(number).toFixed(2))
    });
}

app.get('/c2f/:value', function(req, res) {
    sendResult(res, req.params.value, 'Fahrenheit', temp.celsiusToFahrenheit);
});

app.get('/f2c/:value', function(req, res) {
    sendResult(res, req.params.value, 'Celsius', temp.fahrenheitToCelsius);
});

app.get('/c2k/:value', function(req, res) {
    sendResult(res, req.params.value, 'Kelvin', temp.celsiusToKelvin);
});

app.get('/k2c/:value', function(req, res) {
    sendResult(res, req.params.value, 'Celsius', temp.kelvinToCelsius);
});

app.listen(3000, function() {
    console.log('Server running at http://localhost:3000');
});

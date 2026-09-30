// Open the Express toolbox (installed with npm) so we can build a web server.
var express = require('express');

// Open OUR OWN file, tempConverter.js. The './' means "in this same folder".
// In tempConverter.js, the last part says:
//     module.exports = { celsiusToFahrenheit: celsiusToFahrenheit, ... }
// That list is exactly what require() hands back. So `temp` is an object holding
// the four functions, and we use them as temp.celsiusToFahrenheit(...), etc.
// (Anything in tempConverter.js that is NOT in module.exports stays private.)
var temp = require('./tempConverter.js');


// ---------------- Part 3: convert and print ----------------

// temp.celsiusToFahrenheit(100) gives the number 212.
// .toFixed(2) turns a number into TEXT with exactly 2 decimals: 212 -> '212.00'.
// Then + glues the pieces of text together into one line.
console.log('100°C = ' + temp.celsiusToFahrenheit(100).toFixed(2) + '°F');   // 100°C = 212.00°F
console.log('100°C = ' + temp.celsiusToKelvin(100).toFixed(2) + 'K');        // 100°C = 373.15K
console.log('212°F = ' + temp.fahrenheitToCelsius(212).toFixed(2) + '°C');   // 212°F = 100.00°C


// ---------------- Part 4: the 4 APIs ----------------

// Build an empty server and call it `app`.
var app = express();

// A helper that all four routes share, so we don't write the same code 4 times.
// It receives:
//   res        - the response, so it can send the answer back
//   value      - the number from the URL, still as TEXT (e.g. '20')
//   resultType - the word to put in "result_type" (e.g. 'Fahrenheit')
//   convert    - WHICH conversion function to use (e.g. temp.celsiusToFahrenheit)
function sendResult(res, value, resultType, convert) {
    // The URL always gives text ('20'), so turn it into a real number (20).
    // If it isn't a number at all (like 'abc'), Number() gives NaN = "Not a Number".
    var number = Number(value);

    // isNaN(...) asks "is this Not-a-Number?". If yes, send an error and stop.
    // Status 400 means "bad request": the visitor sent something invalid.
    if (isNaN(number)) {
        res.status(400).json({ error: value + ' is not a number' });
        return;   // stop here, don't try to convert
    }

    // convert(number) runs whichever conversion function we were given.
    //   e.g. convert is temp.celsiusToFahrenheit, number is 20 -> gives 68
    // .toFixed(2) rounds to 2 decimals but gives TEXT ('68.00'),
    // so Number(...) turns it back into a number (68) for the JSON.
    //
    // res.json(...) sends a JavaScript object as JSON. It's like res.send,
    // but it also sets the Content-Type to application/json for you.
    res.json({
        result_type: resultType,
        result: Number(convert(number).toFixed(2))
    });
}

// Each route catches one kind of conversion. ':value' is the fill-in-the-blank
// part of the URL, so visiting /c2f/20 gives req.params.value = '20'.
//
// Notice temp.celsiusToFahrenheit has NO brackets () here.
// We're handing over the function itself for sendResult to call later,
// not calling it now. Same idea as setTimeout(helloWorld, 3000).

// localhost:3000/c2f/20  ->  {"result_type":"Fahrenheit","result":68}
app.get('/c2f/:value', function(req, res) {
    sendResult(res, req.params.value, 'Fahrenheit', temp.celsiusToFahrenheit);
});

// localhost:3000/f2c/30  ->  {"result_type":"Celsius","result":-1.11}
app.get('/f2c/:value', function(req, res) {
    sendResult(res, req.params.value, 'Celsius', temp.fahrenheitToCelsius);
});

// localhost:3000/c2k/0   ->  {"result_type":"Kelvin","result":273.15}
app.get('/c2k/:value', function(req, res) {
    sendResult(res, req.params.value, 'Kelvin', temp.celsiusToKelvin);
});

// localhost:3000/k2c/0   ->  {"result_type":"Celsius","result":-273.15}
app.get('/k2c/:value', function(req, res) {
    sendResult(res, req.params.value, 'Celsius', temp.kelvinToCelsius);
});

// Switch the server on at port (door number) 3000.
// The function runs once, when the server is ready, and prints the address.
app.listen(3000, function() {
    console.log('Server running at http://localhost:3000');
});

// app.js — Importing
import Calculator from './math.js'; // default
import { PI, add, multiply } from './math.js';

// Rename on import
import { add as sum } from './math.js';

// Import everything as namespace
import * as Math2 from './math.js';
Math2.add(1, 2);

// Using imports
const calc = new Calculator();
console.log(calc.add(1, 2));     // 3
console.log(add(3, 4));          // 7
console.log(PI);                  // 3.14159

//------------------------//



// math.js — Named exports
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Or export all at end:
const subtract = (a, b) => a - b;
export { subtract };

// Default export (one per file)
export default class Calculator {
  add(a, b) { return a + b; }
}

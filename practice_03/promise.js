//-------------------------//
//promise

// Given these Promise-based functions:
function getUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: 'Alice' }), 300);
  });
}

function getPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      { id: 1, title: 'ES6 is great' },
      { id: 2, title: 'Vue.js tips' }
    ]), 200);
  });
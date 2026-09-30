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
}

async function loadUserPosts() {
    try{
        const user = await getUser(1);
        console.log('User:', user.name);
        const posts = await getPosts(user.id);
        posts.forEach(p => console.log('Post:', p.title));
    }
    catch(err){
        console.error('Error:', err);

    }
}
loadUserPosts();
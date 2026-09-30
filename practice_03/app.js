getUser(1)
    .then(user => {
        console.log('User:', user.name);
        return getPosts(user.id);
    })
    .then(posts => {
        post.forEach(p => console.log('Post:', p.title));
    })
    .catch(err => console.error('Error:', err));
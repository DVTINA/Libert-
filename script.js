// Initialisation des publications (exemple statique, car pas de backend)
let posts = [
    {
        id: 1,
        title: "Premier Article",
        content: "Ceci est un exemple d'article avec une photo.",
        image: "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg",
        comments: ["Super article !", "Belle photo !"]
    }
];

// Afficher les publications
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-800">${post.title}</h2>
            <p class="text-gray-600 mb-4">${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            <div class="comments mt-4">
                <h3 class="text-lg font-medium text-gray-700">Commentaires</h3>
                ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
                <form class="comment-form mt-2" data-post-id="${post.id}">
                    <input type="text" name="comment" placeholder="Ajouter un commentaire" required class="w-full p-2 border rounded">
                    <button type="submit" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2">Commenter</button>
                </form>
            </div>
        `;
        postsContainer.appendChild(postDiv);
    });

    // Ajouter les écouteurs d'événements pour les formulaires de commentaire
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', handleCommentSubmit);
    });
}

// Gérer la soumission des commentaires
function handleCommentSubmit(e) {
    e.preventDefault();
    const postId = parseInt(e.target.dataset.postId);
    const commentInput = e.target.querySelector('input[name="comment"]');
    const comment = commentInput.value.trim();

    if (comment) {
        const post = posts.find(p => p.id === postId);
        post.comments.push(comment);
        commentInput.value = '';
        displayPosts();

        // Envoyer le commentaire à Web3Forms
        const formData = new FormData();
        formData.append('access_key', '9eae8f19-3986-457e-991f-43c241c17b22');
        formData.append('subject', 'Nouveau commentaire');
        formData.append('post_id', postId);
        formData.append('comment', comment);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => console.log('Commentaire envoyé:', data))
        .catch(error => console.error('Erreur:', error));
    }
}

// Gérer la soumission du formulaire de publication
document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const title = formData.get('title');
    const content = formData.get('content');
    const imageUrl = formData.get('image_url');
    const imageFile = formData.get('image');

    // Créer une nouvelle publication (simulation locale)
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        image: imageUrl || (imageFile.size > 0 ? URL.createObjectURL(imageFile) : ''),
        comments: []
    };
    posts.push(newPost);
    displayPosts();
    this.reset();

    // Envoyer les données à Web3Forms
    formData.append('subject', 'Nouvelle publication');
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Publication envoyée:', data))
    .catch(error => console.error('Erreur:', error));
});

// Initialiser l'affichage
displayPosts();
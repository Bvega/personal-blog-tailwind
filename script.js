// Load saved posts or initialize an empty array
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Flags to track editing state
let editMode = false;
let editId = null;

// DOM element references
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');

// Save the current posts array to localStorage
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Generate a simple unique ID for each post
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Display all blog posts dynamically on the page
function renderPosts() {
  postsContainer.innerHTML = ''; // Clear previous posts

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');

    // Insert post HTML
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <button onclick="editPost('${post.id}')">Edit</button>
      <button class="delete" onclick="deletePost('${post.id}')">Delete</button>
    `;

    postsContainer.appendChild(postEl);
  });
}

// Clear error messages
function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

// Validate input fields and show errors if needed
function validateForm(title, content) {
  clearErrors();
  let valid = true;

  if (!title) {
    titleError.textContent = 'Title is required.';
    valid = false;
  }

  if (!content) {
    contentError.textContent = 'Content is required.';
    valid = false;
  }

  return valid;
}

// Handle form submission for creating or editing posts
postForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent default form behavior

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!validateForm(title, content)) return;

  if (editMode) {
    // Update existing post
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
    }

    // Reset editing state
    editMode = false;
    editId = null;
  } else {
    // Create a new post object
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString()
    };

    posts.push(newPost);
  }

  savePosts();     // Save to localStorage
  renderPosts();   // Refresh UI
  postForm.reset(); // Clear form
});

// Delete post by ID
function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

// Load a post into form fields for editing
function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    titleInput.value = post.title;
    contentInput.value = post.content;
    editMode = true;
    editId = id;
  }
}

// Initial load: show all saved posts
renderPosts();

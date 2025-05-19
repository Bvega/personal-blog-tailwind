let posts = JSON.parse(localStorage.getItem('posts')) || [];
let editMode = false;
let editId = null;

const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const contentError = document.getElementById('content-error');
const postsContainer = document.getElementById('posts-container');

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function renderPosts() {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <button onclick="editPost('${post.id}')">Edit</button>
      <button class="delete" onclick="deletePost('${post.id}')">Delete</button>
    `;
    postsContainer.appendChild(postEl);
  });
}

function clearErrors() {
  titleError.textContent = '';
  contentError.textContent = '';
}

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

postForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!validateForm(title, content)) return;

  if (editMode) {
    const index = posts.findIndex(post => post.id === editId);
    if (index !== -1) {
      posts[index].title = title;
      posts[index].content = content;
    }
    editMode = false;
    editId = null;
  } else {
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: new Date().toISOString()
    };
    posts.push(newPost);
  }

  savePosts();
  renderPosts();
  postForm.reset();
});

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  savePosts();
  renderPosts();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    titleInput.value = post.title;
    contentInput.value = post.content;
    editMode = true;
    editId = id;
  }
}

renderPosts();

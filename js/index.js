document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
});

const user = { id: 1, username: "pouros" }; // Simulated logged-in user

function fetchBooks() {
    fetch("http://localhost:3000/books")
        .then(res => res.json())
        .then(books => renderBookList(books));
}

function renderBookList(books) {
    const bookList = document.getElementById("list");
    bookList.innerHTML = ""; // Clear list before rendering

    books.forEach(book => {
        let li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
    });
}

function showBookDetails(book) {
    const showPanel = document.getElementById("show-panel");
    showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnail}" alt="${book.title}" />
        <p>${book.description}</p>
        <h4>Liked by:</h4>
        <ul id="user-list">
            ${book.users.map(user => `<li>${user.username}</li>`).join("")}
        </ul>
        <button id="like-button">${book.users.some(u => u.id === user.id) ? "Unlike" : "Like"}</button>
    `;

    document.getElementById("like-button").addEventListener("click", () => toggleLike(book));
}

function toggleLike(book) {
    let userList = document.getElementById("user-list");
    let likeButton = document.getElementById("like-button");

    let userIndex = book.users.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
        // User has NOT liked it yet → Add them
        book.users.push(user);
        likeButton.textContent = "Unlike";
    } else {
        // User has already liked it → Remove them
        book.users.splice(userIndex, 1);
        likeButton.textContent = "Like";
    }

    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: book.users })
    })
    .then(() => {
        // Update UI
        userList.innerHTML = book.users.map(u => `<li>${u.username}</li>`).join("");
    });
}
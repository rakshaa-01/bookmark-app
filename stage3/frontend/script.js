const API_URL = 'http://localhost:3000/bookmarks';

//Fetch existing bookmarks when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(bookmarks => {
        bookmarks.forEach(bookmark => addBookmarkToDOM(bookmark));
      })
      .catch(error => console.error("Error fetching bookmarks: ", error));
});


//Add a new bookmark
document.getElementById("add-bookmark-btn").addEventListener("click", () => {
  const title = document.getElementById("bookmark-input");
  const category = document.getElementById("bookmark-category");
  
  if(!title || !category) {
    console.error("Input not found");
    return;
  }

  const newBookmark = {
    uri: title.value,
    category: category.value
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBookmark),
  })
  .then(response => {
    if(!response.ok) {
      alert('Bookmark uri/ category is empty!!')
      return response.json().then(error => {
        throw new Error(error.error);
      });
    }
    return response.json();
  })
  .then(bookmark => {
    addBookmarkToDOM(bookmark);
    title.value = '';
    category.value = '';
  })
  .catch(error => console.error("Error adding bookmark: ", error));
});


function addBookmarkToDOM(bookmark) {
    const bookmarkList = document.getElementById("bookmark-list");

    const bookmarkItem = document.createElement("li");
    bookmarkItem.classList.add("bookmark-item");
    bookmarkItem.setAttribute("data-id", bookmark.id);

    const titleName = document.createElement("span");
    titleName.classList.add("span-uri");
    titleName.textContent = bookmark.uri;

    const category = document.createElement("span");
    category.classList.add("span-category");
    category.textContent = ` (${bookmark.category}) `;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "DELETE";

    const updateButton = document.createElement("button");
    updateButton.classList.add("update-btn");
    updateButton.textContent = "UPDATE";

    //To be done when delete btn is clicked
    deleteButton.addEventListener("click", () => {
      const idToDelete = bookmark.id;
  
      fetch(`${API_URL}/${idToDelete}`, {
        method: 'DELETE',
      })
      .then(() => {
        const bookmarkItem1 = document.querySelector(`[data-id='${idToDelete}']`);
        bookmarkItem1.remove();
      })
      .catch(error => console.error("Error deleting bookmark: ", error));
    });

    //To be done when update btn is clicked
    updateButton.addEventListener("click", () => updateBookMarkById_textbox(bookmark.id));

    //Normal flow of above adding bookmark to DOM
    bookmarkItem.appendChild(titleName);
    bookmarkItem.appendChild(category);
    bookmarkItem.appendChild(deleteButton);
    bookmarkItem.appendChild(updateButton);
    bookmarkList.appendChild(bookmarkItem);
}

//---------------------------------------------------------------------------------------------------
//Update bookmark methods below -
// function updateBookMarkById_prompt(id) {
//   const newUri = prompt("Enter the updated URL: ");

//   if(!newUri) {
//     alert("URL is required to update the bookmark!");
//     return;
//   }

//   fetch(`${API_URL}/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ uri: newUri }),
//   })
//   .then(response => response.json())
//   .then(updatedBookmark => {
//     const item = document.querySelector(`[data-id='${id}']`);
//     const titleName = item.querySelector("span");
//     titleName.textContent = updatedBookmark.uri;
//   })
//   .catch(error => console.error("Error updating bookmark: ", error));
// }

function updateBookMarkById_textbox(id) {
  // Find the bookmark item in the DOM
  const bookmarkItem = document.querySelector(`[data-id='${id}']`);
  const titleName = bookmarkItem.querySelector(".span-uri");
  let category = bookmarkItem.querySelector(".span-category");
  const updateButton = bookmarkItem.querySelector(".update-btn");

  // Create an input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.value = titleName.textContent; // Pre-fill with current URL
  inputField.className = "update-input";

  // Create an input field for category
  let categoryValue = category.textContent.trim().replace(/^\(|\)$/g, '');

  const categoryField = document.createElement("input");
  categoryField.type = "text";
  categoryField.value = categoryValue;
  categoryField.className = "update-category";

  //Create a save boutton
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.className = "save-btn";

  // Replace the existing text and "Update" button with the input field and "Save" button
  titleName.style.display = "none";
  category.style.display = "none";
  updateButton.style.display = "none";
  bookmarkItem.appendChild(inputField);
  bookmarkItem.appendChild(categoryField);
  bookmarkItem.appendChild(saveButton);

  // Add event listener for "Save" button
  saveButton.addEventListener("click", () => {
      const newUri = inputField.value;
      const newCategory = categoryField.value.trim();

      if (!newUri || !newCategory) {
          alert("URL and category cannot be empty!");
          return;
      }

      // Send a PUT request to the API
      fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            uri: newUri,
            category: newCategory,
           }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error("Failed to update bookmark");
          }
          return response.json();
      })
      .then(updatedBookmark => {
          // Update the DOM with the new URL
          titleName.textContent = updatedBookmark.uri;
          category.textContent = ` (${updatedBookmark.category}) `;

          titleName.style.display = "inline";
          category.style.display = "inline";
          updateButton.style.display = "inline";
          inputField.remove();
          categoryField.remove();
          saveButton.remove();
      })
      .catch(error => console.error("Error updating bookmark: ", error));
  });
}

document.getElementById("search-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const searchWord = document.getElementById("query");

  if(!searchWord) {
    alert("Search text empty, can't search!");
    return;
  }

  fetch(`${API_URL}/search?q=${searchWord.value}`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(filteredBookmarks => {
    const bookmarkList = document.getElementById("bookmark-list");
    bookmarkList.innerHTML = "";
    filteredBookmarks.forEach(bookmark => addBookmarkToDOM(bookmark));
  })
  .catch(error => console.error("Error fetching search results - ", error));
});

document.getElementById("reset").addEventListener("click", () => {
  fetch(API_URL)
      .then(response => response.json())
      .then(bookmarks => {
        bookmarks.forEach(bookmark => addBookmarkToDOM(bookmark));
      })
      .catch(error => console.error("Error fetching bookmarks: ", error));
});
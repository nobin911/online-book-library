/** @format */

//targeting elements:

let booksContainer = document.querySelector("#booksContainer");
let viewBtn = document.querySelector("#viewBtn");
let listViewBtn = document.querySelector("#listViewBtn");
let searchIcon = document.querySelector("#search-icon");
let btnText = document.querySelector("#btnText");
let searchBar = document.querySelector("#search-input");
let sortByDateBtn = document.getElementById("sortByDate");
let sortByTitleBtn = document.getElementById("sortByTitle");
let booksArray = [];
let pageNumber = 1;
const itemsPerPage = 3;

//fetching books info through api calling::

const fetchingBooks = async () => {
  const url =
    "https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech";
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.statusCode === 200) {
      let books = data.data.data;

      //Extracting books info from the API response:

      booksArray = books.map((book) => {
        return {
          title: book.volumeInfo.title,
          publisher: book.volumeInfo.publisher,
          author: book.volumeInfo.authors[0],
          publishedDate: book.volumeInfo.publishedDate,
          thumbnail: book.volumeInfo.imageLinks.thumbnail,
          infoLink: book.volumeInfo.infoLink,
        };
      });

      //storing books Info in the local storage

      // localStorage.setItem("booksInfo", JSON.stringify(booksInfo));
      booksDisplay(booksArray);
    }
  } catch (error) {
    console.error(error);
  }
};

//Displaying Books with pagination

const booksDisplay = (books) => {
  let bookDiv = document.createElement("div");

  bookDiv.classList.add("book");
  //Giving default view in Grid
  booksContainer.classList.add("gridView");

  //pagination code
  let starIndex = (pageNumber - 1) * itemsPerPage;
  let lastIndex = starIndex + itemsPerPage;
  let booksToDisplay = books.slice(starIndex, lastIndex);

  booksContainer.innerHTML = booksToDisplay
    .map(
      (book) => `
      <a href="${book.infoLink}" target="_blank" class="anchor">
            
             <div id="bookItem" >
               <h3>Title: ${book.title}</h3>
               <div class="book">
               <div class="img">
              
                 <img src="${book.thumbnail}" width="150px" ; height="160px" ; />
               </div>
             <div id="bookInfo">
                 <h4>Author: ${book.author}</h4>
                 <h4>Publisher: ${book.publisher}</h4>
                 <p>Published Date: ${book.publishedDate}</p>
                 <button id="readMoreBtn">Read More</button>
               </div>
               
             </div>
             </div>
             </a>`
    )
    .join("");

  // updating pages for pagination

  updatePagination();
};

//pagination page control

function updatePagination() {
  const pageInfo = document.querySelector("#pageInfo");
  const totalPages = Math.ceil(booksArray.length / itemsPerPage);

  // pageInfo.textContent = `page ${pageNumber} of ${totalPages}`;

  prevBtn.disabled = pageNumber === 1;
  nextBtn.disabled = pageNumber === totalPages;
}

//increasing the page number

function nextPage() {
  pageNumber++;
  booksDisplay(booksArray);
}

//decreasing the page number

function prevPage() {
  pageNumber--;
  booksDisplay(booksArray);
}

//loading pages with button click:

nextBtn.addEventListener("click", nextPage);
prevBtn.addEventListener("click", prevPage);

//Toggle view function:

let toggleView = () => {
  let currentView = booksContainer.classList;

  if (
    // currentView.value === "booksContainer" ||
    currentView.value === "booksContainer gridView"
  ) {
    booksContainer.classList.remove("gridView");
    booksContainer.classList.add("listView");

    viewBtn.classList.remove("ri-layout-grid-fill");
    viewBtn.classList.add("ri-file-list-fill");
    btnText.textContent = " list";
  } else {
    booksContainer.classList.add("gridView");
    booksContainer.classList.remove("listView");

    viewBtn.classList.add("ri-layout-grid-fill");
    viewBtn.classList.remove("ri-file-list-fill");
    btnText.textContent = "Grid";
  }
};

//Filtering books using search bar function

let filterSearchBooks = () => {
  // let books = JSON.parse(localStorage.getItem("booksInfo"));
  let query = searchBar.value.toLowerCase();

  console.log(query);

  let filteredBooks = booksArray.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
  );
  booksDisplay(filteredBooks);
};

//Sorting functions:::
//sort by Title

let sortBooksByTitle = () => {
  booksArray.sort(
    (a, b) => a.title.localeCompare(b.title) // Alphabetical order by title
  );

  booksDisplay(booksArray);
};

//sort by date

let sortBooksByDate = () => {
  booksArray.sort((a, b) => {
    return new Date(a.publishedDate) - new Date(b.publishedDate);
  });

  booksDisplay(booksArray);
};

//Executing fetchingBooks function on window Loads

window.addEventListener("load", fetchingBooks());

//implementing grid and list view feature

viewBtn.addEventListener("click", toggleView);

//Implementing a search bar to filter books by title or author

searchBar.addEventListener("input", filterSearchBooks);

// Implementing sorting the books
sortByDateBtn.addEventListener("click", sortBooksByDate);
sortByTitleBtn.addEventListener("click", sortBooksByTitle);

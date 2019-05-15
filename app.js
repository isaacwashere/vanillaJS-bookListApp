//Book class
//Represents a book, 
//Each time a book is created, a book object will be instantiated

class Book {
  //constructor = a method that runs when a book is instantiated
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn =  isbn;
  }
}



//UI Class
//Handle UI Tasks
//when a book is displayed or removed or show an alert 
//Don't want to have to instantiate the UI class so only using static methods
class UI {
  static displayBooks() {
    const StoredBooks = [
      {
        title: "Vanilla JS",
        author: "Mrs. J.S. Runs",
        isbn: '23423424'
      },
      {
        title: "Chocolate JS",
        author: "Mr. J.S. Codes",
        isbn: '23423424'
      }
    ];

    //setting the constant books equal to the array of books 
    const books = StoredBooks;
    
    //want to loop through the array of books and send it to the UI class that will display it in the list
    books.forEach((book) => UI.addBookToList(book));
  }

  //here: create the row to put/inject into the tbody element in the html
  static addBookToList(book) {
    //grab onto the element in the dom that has an id of booklist
    const list = document.querySelector('#book-list');

    // now need to create a table row element aka want to insert a tr into the booklist
    const row = document.createElement('tr');

    //wnat to add the columns 
    row.innerHTML = `
      <td>${ book.title }</td>
      <td>${ book.author }</td>
      <td>${ book.isbn }</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Remove</a></td>
    `;

    //append the row to the list 
    list.appendChild(row);
  }

  static deleteBook(target) {
    if(target.classList.contains('delete') ) {
      //target the delete button but want to remove the parent aka the whole row itself 

      //clicking the delete link, it's parent element is actually the 'td' and the 'td's parent element is the actual row, the "tr"
      target.parentElement.parentElement.remove();
    }
  }

  //clears out the form on submission
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}



//Store Class
//Handles and takes care of storage
//Right now this storage will be local storage i.e. in the browser




//Events: Display
//to display books and show them in the list 

//as soon as the DOM loads, call UI.displayBooks
document.addEventListener('DOMContentLoaded', UI.displayBooks);




//Event: Add
//to add a book to the list 

//want to grab the form and listen for the submit 
//when submit happens, the arrow function executes
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  //1st need to get the form values
  //since this is an input, don't want the element, want the value
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //2nd instantiate a book from the book class 
  //need to instantiate because the method to add a book is not static

  const book = new Book(title, author, isbn);

  //Add book to UI
  UI.addBookToList(book);

  //Clear fields after a book is submitted
  UI.clearFields();
});



//Event: Remove
//to remove a book (in the UI and local storage)

//because multiple delete events, not going to target an individual one 
// use event propogation(select the entire booklist, the part above the delete and target what's clicked inside of it)

document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target)
});





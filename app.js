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
    //setting the constant books equal to the array of stored books in local storage
    const books = Store.getBooks();
    
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
      //target the delete button but want to remove the grandparent aka the whole row itself 

      //clicking the delete link, it's parent element is actually the 'td' and the 'td's parent element is the actual row, the "tr"
      target.parentElement.parentElement.remove();
    }
  }

  //for showing an alert that is more visually appealing 
  //want a message and a class name so styling the alert is easiser
  static showAlert(message, className) {
    //going to build from scratch and insert in to the ui
    
    //final product/goal = <div class="alert alert-success or alert-danger">MESSGAGE</div>
    const div = document.createElement('div');
    div.className = `alert alert-${ className }`; //use className so that you can pass in success/danger instead of having to pass in alert-success or alert-danger
    div.appendChild(document.createTextNode(message)); //want to put text in the div, text = message passed in 

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form); //insert the div before the form

    //want the error message to go away after "x" amount of seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000); //setTimeout takes 2 parameters, a function and the number of milliseconds
    //anything with class of alert wantto remove



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

class Store {
  //3 methods, 1 to get books, add a book, and remove a book 
  //need to make them static so can call them directly without have to instantiate the Store class

  //since local storage only stores key value pairs (aka can't store objects), going to use an item call books which is...
  //...going to be a string version of the entire array of books 
  //before I add to local storage, going to stringify it and when I extract it going to parse it
  static getBooks() {
    let books; 
    //check to see if there is a current book item in local storage 
    if(localStorage.getItem('books') === null) {
      books = []; 
    }
    else {
      books = JSON.parse(localStorage.getItem('books')); //since books will be stored as string, need to run it through JSON.parse so can use it as an array of objects
    }
    return books;
  }

  static addBook(book) {
    //grab whatever is stored in local storage
    const books = Store.getBooks();

    //push to that array whatever is passed in as a book
    books.push(book);

    //then reset it to the localstorage
    //books is initially an array of objects so have to use JSON.stringify to make it a string so the UI add/display it
    localStorage.setItem('books', JSON.stringify(books));


  }

  static removeBook(isbn) {
    //remove by the isbn because the isbn is going to be unique, going to use this like an id or primary key

    //1st get the bookss
    const books = Store.getBooks();

    //loop through the books with a forEach
    books.forEach((book, index) => {
      //if the current books isbn matches the one that is passed in for remove book
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
      //then need to reset local storage with that book removed 
      localStorage.setItem('books', JSON.stringify(books));
    });
  }

}



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

  //2nd Validate to make sure all fields are filled in 
  if(title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  }
  else {
    //3rd instantiate a book from the book class 
    //need to instantiate because the method to add a book is not static
    const book = new Book(title, author, isbn);
  
    //Add book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //Show success message when book is added properly
    UI.showAlert('Book successfully added', 'success');
  
    //Clear fields after a book is submitted
    UI.clearFields();
  }
});



//Event: Remove
//to remove a book (in the UI and local storage)

//because multiple delete events, not going to target an individual one 
// use event propogation(select the entire booklist, the part above the delete and target what's clicked inside of it)
document.querySelector('#book-list').addEventListener('click', (e) => {
  
  //removes book from UI
  UI.deleteBook(e.target)

  //remove book from the store
  //removeBook takes in the isbn
  //parentElement is the "td" so neeed to traverse the DOM, to get to the sibling of the parent element
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show success message when book is added properly
  UI.showAlert('Book successfully removed', 'success');
});


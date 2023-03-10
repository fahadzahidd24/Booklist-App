class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {
        // const storedBooks = [
        //     {
        //         title: "chips",
        //         author: "like",
        //         isbn: "1234"
        //     },
        //     {
        //         title: "chips2",
        //         author: "like2",
        //         isbn: "78910"
        //     }
        // ]
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = ` 
      <td class="titleTd">${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
      list.appendChild(row);
    }
    static clearFields(){
        document.querySelector('#book-form').reset();
    }
    static alertMsg(msg,className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        let container = document.querySelector(".container");
        let form = document.querySelector("#book-form");
        container.insertBefore(div,form);
        setTimeout( ()=> document.querySelector(".alert").remove(),2000);
    }
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
          el.parentElement.parentElement.remove();
        }
      }
    static search(value){
        let table = document.querySelectorAll('.titleTd')
        // console.log(table[1].innerText);
        table.forEach((title)=>{
            if(title.innerText.toUpperCase().indexOf(value)!= -1){
               title.parentElement.style.display = '' 
            }
            else{
                title.parentElement.style.display = 'none';
            }
        })

    }
}
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books;
    }
    static addBook(book){
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book)=>{
            if(book.isbn === isbn){
                books.splice(book,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books))
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.querySelector("#book-form").addEventListener('submit',(e)=>{
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    if(title===''||author===''||isbn===''){
        UI.alertMsg("Please Fill all the Fields!",'danger');
    }
    else{
        const book = new Book(title,author,isbn);
        UI.addBookToList(book);
        UI.clearFields();
        UI.alertMsg("Book Added!",'success');
        Store.addBook(book);
    }
})
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.alertMsg("Book Removed!",'success');
})
document.querySelector('.input').addEventListener('keyup',(e)=>{
    UI.search(e.target.value.toUpperCase());
})
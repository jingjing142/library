//Book class
class Book {
    constructor(title, author, pages, read = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read;
    }
}

//Set up local storage
let myLibrary = localStorage.getItem('library') ?
JSON.parse(localStorage.getItem('library')) : 
[
    new Book ("Mindset", "Carol S. Dweck", "320", true),
    new Book ("One Day", "David Nicholls", "437", false),
]

function saveToLocalStorage() {
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

//Add book to library array 
function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Book(title, author, pages, read));
}

//Toggle new book form
const addBookBtn = document.querySelector('button#add-book-btn');
const form = document.querySelector('form');

const toggleForm = () => {
    form.classList.toggle('hidden');

    if (form.className == 'hidden') {
        addBookBtn.textContent = '+ Add Book';
    } else {
        addBookBtn.textContent = '- Add Book';
    }
}

addBookBtn.addEventListener('click', toggleForm);

//Display book
function display(book) {
    const bookList = document.querySelector('#book-list');
    const newRow = document.createElement('tr');

    //Set data-index to distinguish rows
    newRow.setAttribute('data-index', myLibrary.indexOf(book));
    newRow.setAttribute('class', 'visible');

    newRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
        `

    //Add status button
    const statusCol = document.createElement('td')
    const statusBtn = document.createElement('button');
    statusBtn.classList.add('statusBtn');

    if (book.read) {
        statusBtn.classList.add('read');
        statusBtn.textContent = 'Read';
    } else {
        statusBtn.classList.add('unread');
        statusBtn.textContent = 'Unread';
    }

    statusCol.appendChild(statusBtn);

    //Add delete icon 
    const deleteIcon = document.createElement('td');
    deleteIcon.innerHTML = `<img class="delete-icon" src="img/delete_icon.png">`

    //Putting it all together
    newRow.appendChild(statusCol);
    newRow.appendChild(deleteIcon);
    bookList.appendChild(newRow);
}

document.addEventListener('DOMContentLoaded', myLibrary.forEach(book => display(book)));

//Toggle read and unread
document.querySelector('#book-list').addEventListener('click', (e) => {
    const statusBtn = e.target;

    if(statusBtn.classList.contains('statusBtn')) {
        let tableRow = statusBtn.parentNode.parentNode
        let index = +tableRow.getAttribute('data-index');
        myLibrary[index].read = !myLibrary[index].read
        localStorage.clear();
        saveToLocalStorage();
    
        if (statusBtn.classList.contains('statusBtn')) {
            statusBtn.classList.toggle('unread');
            statusBtn.classList.toggle('read');
    
            switch (statusBtn.textContent) {
                case "Unread":
                    statusBtn.textContent = "Read"
                    break;
                case "Read":
                    statusBtn.textContent = "Unread"
            }
        }
    }

    filterBooks();
})

//Add new book button
const addBtn = document.querySelector('#add-btn');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');
const readCheckbox = document.querySelector('#read-status');

//Validation
function showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`
    div.appendChild(document.createTextNode(message));

    const form = document.querySelector('#new-book-form');
    const titleLabel = document.querySelector('label[for="title"]');

    form.insertBefore(div, titleLabel);

    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

//Add new book
const addRow = (e) => {
    e.preventDefault();

    if (titleInput.value === '') {
        showAlert('Please fill in a title', 'warning');
    } else if (authorInput.value === '') {
        showAlert('Please fill in an author', 'warning');
    } else {
        if (readCheckbox.checked) {
            read = true;
        } else {
            read = false;
        }

        addBookToLibrary(
            titleInput.value,
            authorInput.value,
            pagesInput.value,
            read
        );

        const newestBook = myLibrary[myLibrary.length - 1];
        display(newestBook);
        filterBooks();
        saveToLocalStorage();

        //Empty input again
        titleInput.value = '';
        authorInput.value = '';
        pagesInput.value = '';
        readCheckbox.checked = false;

        //Refocus on title
        titleInput.focus();

        showAlert('Book Added', 'success')
    }
}

addBtn.addEventListener('click', addRow)

//Remove book
document.querySelector('#book-list').addEventListener('click', (e) => {
    if (e.target.classList == 'delete-icon') {
        e.target.parentElement.parentElement.remove();

        //Remove book from library array
        const index = e.target.parentElement.parentElement.getAttribute('data-index');
        myLibrary.splice(index, 1);
        localStorage.clear();
        localStorage.setItem('library', JSON.stringify(myLibrary));
    }
})

//Filter books
const optionAll = document.querySelector('#all');
const optionReadOnly = document.querySelector('#read-only');
const optionUnreadOnly = document.querySelector('#unread-only');

function filterBooks() {
    const readStatus = document.querySelectorAll('td button')

    if (optionAll.selected) {
        readStatus.forEach(button => {
            const index = button.parentElement.parentElement.getAttribute('data-index');
            const tableRow = button.parentElement.parentElement

            tableRow.removeAttribute('class')
            tableRow.removeAttribute('style')
            tableRow.setAttribute('class', 'visible')
        });
    } else if (optionReadOnly.selected) {
        readStatus.forEach(button => {
            const index = button.parentElement.parentElement.getAttribute('data-index');
            const tableRow = button.parentElement.parentElement

            if (myLibrary[index].read) {
                tableRow.removeAttribute('class');
                tableRow.removeAttribute('style')
                tableRow.setAttribute('class', 'visible')
            } else if (myLibrary[index].read == false) {
                tableRow.removeAttribute('class')
                tableRow.removeAttribute('style')
                tableRow.setAttribute('class', 'hidden');
            }
        })
    } else if (optionUnreadOnly.selected) {
        readStatus.forEach(button => {
            const index = button.parentElement.parentElement.getAttribute('data-index');
            const tableRow = button.parentElement.parentElement

            if (myLibrary[index].read == false) {
                tableRow.removeAttribute('class');
                tableRow.removeAttribute('style')
                tableRow.setAttribute('class', 'visible')
            } else if (myLibrary[index].read) {
                tableRow.removeAttribute('class');
                tableRow.removeAttribute('style')
                tableRow.setAttribute('class', 'hidden');
            }
        })
    }

    const visibleRows = document.querySelectorAll('.visible');
    let lastVisibleRow = visibleRows[visibleRows.length - 1];
    lastVisibleRow.style.cssText = 'border-bottom-style: none';
}

const filter = document.querySelector('#filter');
filter.addEventListener('change', filterBooks);



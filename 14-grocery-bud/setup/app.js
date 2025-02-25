// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container'); 
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
  

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems);

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);


// ****** FUNCTIONS **********

function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    items.forEach(function (item) {
        list.removeChild(item);
    });
    container.classList.remove('show-container');
    displayAlert("empty list", "danger");
    localStorage.removeItem('list');
    setBackToDefault();
}


function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    console.log(editFlag);
    const id = new Date().getTime().toString();

    if (value && !editFlag) {

        createListItem(id, value);

       
        container.classList.add('show-container');

        addToLocalStorage(id, value);

        
        displayAlert(value +" added", "success");
    }else if (value && editFlag) {
        editLocalStorage(editID, value);
        editElement.innerHTML = value;
        displayAlert("value changedaaaaa", "success");
    }else {
        displayAlert("please enter value", "danger");
    }

    setBackToDefault();
}

function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    list.removeChild(element);
    if(list.children.length > 0) {
        container.classList.remove("show-container");
    }

    displayAlert("item deleted successfuly", "success");
    removeFromLocalStorage(id);
    setBackToDefault();

}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement= e.currentTarget.parentElement.previousElementSibling;
    grocery.value=editElement.innerHTML;
    editFlag=true;
    editID=element.dataset.id;
    submitBtn.textContent = 'Update';
    console.log(editFlag);
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id,value) {
   
    const grocery = {id,value};
    
    let items = getLocalStorage();

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));

}
function removeFromLocalStorage(id) {
    let items=getLocalStorage();

    items=items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem('list',JSON.stringify(items));
    console.log(localStorage.getItem('list'));
}

function editLocalStorage(id,value){
    let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  }





// ****** SETUP ITEMS **********

function setupItems() {
    let items = getLocalStorage();
  
    if (items.length > 0) {
      items.forEach(function (item) {
        createListItem(item.id, item.value);
      });
      container.classList.add("show-container");
    }
  }
  
  function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
              <div class="btn-container">
                <!-- edit btn -->
                <button type="button" class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <!-- delete btn -->
                <button type="button" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `;
    // add event listeners to both buttons;

    const deleteButton = element.querySelector('.delete-btn');
    const editButton = element.querySelector('.edit-btn');
    
    deleteButton.addEventListener('click', deleteItem);
    editButton.addEventListener('click', editItem);


    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);


  
    // append child
    list.appendChild(element);
  }
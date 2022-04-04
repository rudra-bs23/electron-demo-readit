// modules
const {ipcRenderer} = require('electron');
const items = require('./items');

// DOM nodes
const showModal = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItem = document.getElementById('add-item');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

window.newItem = () => {
  showModal.click()
}

window.searchItem = () => {
  search.focus();
}

// toggle modal 
const toggleModal = () => {
  if(addItem.disabled){
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add item';
    closeModal.style.display = 'inline';
  }else{
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'adding...';
    closeModal.style.display = 'none';
  }
}

// toggle show modal
showModal.addEventListener('click', (e) => {
  modal.style.display = 'flex';
  itemUrl.focus()
})

// toggle close modal
closeModal.addEventListener('click', (e) => {
  modal.style.display = 'none';
})

// handle add item
addItem.addEventListener('click', (e) => {
  if(itemUrl.value){
    ipcRenderer.send('new-item', itemUrl.value)
    toggleModal()
  }
})

// handle add by pressing enter 
itemUrl.addEventListener('keyup', e => {
  if(e.key === 'Enter'){
    addItem.click()
  }
})



// navigate items with key
document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
    items.changeSelection(e.key);
  }
})

// filter item with search
search.addEventListener('keyup', e => {
  console.log('test')
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    // hide items that dont match 
    const hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : 'none';
  })
})


// listen for new item successfully loaded from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  
  items.addItem(newItem, true);

  toggleModal()
  modal.style.display = 'none';
  itemUrl.value = '';
})

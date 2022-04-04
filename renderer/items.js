const items = document.getElementById('items');
const fs = require('fs');
let readerJs;

fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJs = data.toString();
})

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

exports.select = (e) => {
  // remove currently elected item class
  document.getElementsByClassName('read-item selected')[0].classList.remove('selected');
  
  // add selected class to currently clicked item
  e.currentTarget.classList.add('selected');
}

// listen for done message
window.addEventListener('message', e => {
  if(e.data.action === 'delete-reader-item'){
    // delete item at given index
    this.delete(e.data.itemIndex);

    // close reader window 
    e.source.close();
  }
})

// handle delete item

exports.delete = itemIndex => {
  items.removeChild(items.childNodes[itemIndex+1]);
  this.storage.splice(itemIndex, 1);
  console.log("from delete index => ", itemIndex)
  this.save();

  // select item
  if(this.storage.length){
    console.log(itemIndex)
    const newSelectedItemIndex = (itemIndex === 0) ? itemIndex : itemIndex-1;
    document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected');
  }
}

// move to newly selected item
exports.changeSelection = (key) => {
  const currentItem = this.getSelectedItem().node;
  if(key === 'ArrowUp' && currentItem.previousSibling.nodeType===1){
    currentItem.classList.remove('selected');
    currentItem.previousSibling.classList.add('selected');
  }else if(key == 'ArrowDown' && currentItem.nextSibling){
    currentItem.classList.remove('selected');
    currentItem.nextSibling.classList.add('selected');
  }
}

// export selected item w/ index
exports.getSelectedItem = () => {
  const currentItem = document.getElementsByClassName('read-item selected')[0];
  //get item index
  const index = Array.from(currentItem.parentNode.children).indexOf(currentItem);
  return {node: currentItem, index};
}

// open selected item`
exports.open = () => {
  console.log(Array.from(items.childNodes))
  if(!this.storage.length)return;

  const selectedItem = this.getSelectedItem().node;
  const contentUrl = selectedItem.dataset.url;
  const renderWin = window.open(contentUrl, '', `
    maxWidth= 2000,
    maxHeight= 2000,
    width= 1200,
    height= 800,
    backgroundColor = #dedede, 
    nodeIntegtaion = 0,
    contextIsolation = 1
  `);

  // inject js
  renderWin.eval( readerJs.replace('{{index}}', this.getSelectedItem().index));
}


exports.addItem = (item, isNew = false) => {
  const itemNode = document.createElement('div');

  itemNode.setAttribute('class', 'read-item');
  itemNode.setAttribute('data-url', item.url);

  itemNode.innerHTML = `
    <img src="${item.screenshot}"/>
    <h2>${item.title}</h2>
  `;

  items.appendChild(itemNode);
  if(isNew){
    this.storage.push(item);
    this.save();
  }

  // select an item
  itemNode.addEventListener('click', this.select);
  if(document.getElementsByClassName('read-item').length === 1){
    itemNode.classList.add('selected');
  }

  // open an item
  itemNode.addEventListener('dblclick', this.open)

}

// get all item from local storage on reload 
this.storage.forEach(item => {
  this.addItem(item);
});
const {remote, shell} = require('electron');
const { open, delete: itemDelete, getSelectedItem} = require('./items');


// menu template
const template = [
  {
    label: "Items",
    submenu: [
      {
        label: 'new item',
        click: () => {
          window.newItem();
        },
        accelerator: 'CmdOrCtrl+O'
      },
      {
        label: 'read item',
        accelerator: 'CmdOrCtrl+Enter',
        click: () => open()
      },
      {
        label: 'delete item',
        accelerator: 'CmdOrCtrl+Backspace',
        click: () => itemDelete(getSelectedItem().index)
      },
      {
        label: 'search items',
        accelerator: 'CmdOrCtrl+S',
        click: () => window.searchItem()
      },
      {
        label: 'open in browser',
        accelerator: 'CmdOrCtrl+Shift+Enter',
        click: () => {shell.openExternal(getSelectedItem().node.dataset.url)}
      }
    ]
  },
  {
    role: 'editMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'learn more',
        click: () => {shell.openExternal('https://electronjs.org')}
      }
    ]
  }
];


// build menu
const menu = remote.Menu.buildFromTemplate(template);


// set as main app menu
remote.Menu.setApplicationMenu(menu)
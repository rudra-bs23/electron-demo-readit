const {BrowserWindow} = require('electron');
const fs = require('fs');

let offscreenWindow;

module.exports = (url, callback) => {
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true
    }
  })
  // offscreenWindow.webContents.openDevTools()
  offscreenWindow.loadURL(url);
  let title, screenshot;
  offscreenWindow.webContents.on('did-finish-load', async (e) => {
    title = offscreenWindow.getTitle();
    screenshot = await offscreenWindow.webContents.capturePage().then(image => {
      return image.toDataURL()
  })
  callback({title, screenshot, url})
  offscreenWindow.close();
  offscreenWindow = null;
  })

}
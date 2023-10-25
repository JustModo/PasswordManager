const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

function createWindow () {

    const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
    }
    })

    win.loadFile('frontend/html/index.html')

    win.setMenu(null);

    win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
        return { action: 'deny' };
    });


}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
      event.preventDefault();
      require('electron').shell.openExternal(navigationUrl);
    });
  });



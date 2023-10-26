const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { spawn } = require('node:child_process');    
const rest_api = spawn('python', ['./backend/rest_api.py']);

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

    win.webContents.openDevTools();
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  rest_api.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  rest_api.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  rest_api.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
  }); 
  
});

app.on('before-quit', () => {
  rest_api.kill();
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










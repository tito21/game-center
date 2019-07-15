const { app, BrowserWindow } = require('electron');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// Global games list reference
let games;

const searchGames = (callback) => {
  games = {};
  fs.readdir(`${__dirname}/../games`, {withFileTypes: true}, (err, contents) => {
    if (err) throw err;
    for (let d of contents) {
      if (d.isDirectory()) {
        console.log(__dirname);
        fs.readFile(`${__dirname}/../games/${d.name}/package.json`, 'utf8', (err, info) => {
          if (err) throw err;
          let g = JSON.parse(info)
          games[g.name] = g;
        });
      }
    }
    callback(games)
  });

};

const loadGame = (_ev, channel, key) => {
  console.log(games);
  if (channel == 'load-game') {
    console.log(key);
    GameWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });
    GameWindow.loadURL(`file://${__dirname}/../games/${key}/${games[key].main}`);
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();


  searchGames((games) =>{
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('game-list', games);
      // console.log(games);
      mainWindow.webContents.addListener('ipc-message', loadGame);
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });



};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

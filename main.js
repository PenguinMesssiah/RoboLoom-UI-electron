const { app, BrowserWindow, ipcMain } = require('electron')
const { SerialPort }                  = require('serialport')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, windows, activeSerialPort

function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: true, // to allow require
            contextIsolation: true, // allow use with Electron 12+
            preload: path.join(__dirname, 'preload.js')
        }
    })
        mainWindow.webContents.openDevTools();

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows
        mainWindow = null
    })
}

// set up an internal app communication channel.
//const { port0, port1 } = new MessageChannelMain()
ipcMain.handle('get-serial', async () => { return SerialPort.list()})

// Initialize and create browser windows when app is ready.
app.on('ready', () => {
    //ipcMain.handle('channel_one', () => async () => {})
    createMainWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit()
})

// Re-create a window in the app when the dock icon is clicked
// & there are no other windows open.
app.on('activate', function() {
    if (mainWindow === null) {
        createMainWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

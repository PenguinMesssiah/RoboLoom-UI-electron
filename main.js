const { app, BrowserWindow, ipcMain, MessageChannelMain } = require('electron')
const { SerialPort }                  = require('serialport')

const path = require('path')
const url  = require('url')
var List   = require("collections/list");

let mainWindow
let activeSerialPort = null
let appWindows       = new List()

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
    appWindows.push(mainWindow)
    //mainWindow.webContents.openDevTools();

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
    mainWindow.webContents.openDevTools();
}

function createCalWindow() {
    calWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        parent: mainWindow,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: true, // to allow require
            contextIsolation: true
        }
    })

    calWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'cal_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    appWindows.push(calWindow)
    
    // Emitted when the window is closed.
    calWindow.on('closed', function() {
    })
}

function openSerialConnetion(event, path) {
    //console.log("path = ", path)

    if(activeSerialPort == null) {
        activeSerialPort = new SerialPort({
            path: path,
            baudRate: 115200,
            autoOpen: true
        })
    }

    //console.log("activeSerialPort status = ", activeSerialPort.open())
    /*
    activeSerialPort.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message)
        }
        else {
            // Because there's no callback to write, write errors will be emitted on the port:
            //port.write('main screen turn on')
            console.log('Serial Port Open on ', activeSerialPort.path, ' and baudrate: ', activeSerialPort.baudRate)
        }
    })
    */
}

//Inter-Process Communication
//const { port0, port1 } = new MessageChannelMain()
ipcMain.on('send-serial-port', openSerialConnetion)
ipcMain.handle('get-serial', async () => { return SerialPort.list()})
ipcMain.handle('cal-window', async () => {
    await app.isReady('ready', createCalWindow())
})

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

const { app, BrowserWindow, ipcMain, utilityProcess } = require('electron')
const { SerialPort } = require('serialport')
const path  = require('path')
const url   = require('url')
const List  = require("collections/list");


let mainWindow          = null
let shaftWeaveWindow    = null
let jacquardWeaveWindow = null
let activeSerialPort    = null
let matrix_child        = null
let jquery_child        = null
let appWindows          = new List()

function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: false, // to allow require
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
    //mainWindow.webContents.openDevTools();
}

function createCalWindow() {
    calWindow = new BrowserWindow({
        width: 600,
        height: 500,
        parent: mainWindow,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: false, // to allow require
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
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

function createShaftWeaveWindow() {
    //Create Utility Service
    matrix_child = utilityProcess.fork(path.join(__dirname, './assets/util/ndarray_fnc'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'Matrix Utility Process'
    })

    shaftWeaveWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        //parent: calWindow,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: false, // to allow require
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'shaft_preload.js')
        }
    })

    shaftWeaveWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'shaft_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    appWindows.push(shaftWeaveWindow)
   
    matrix_child.on('message', (message) => {
        var drawdown_matrix = message.drawdown_matrix
        //send message back to shaft renderer
        if(drawdown_matrix !== null) {
            shaftWeaveWindow.webContents.send('drawdown-update', drawdown_matrix)
        }
    })

    // Emitted when the window is closed.
    shaftWeaveWindow.on('closed', function() {
        matrix_child.kill()
    })
}

function createJacquardWeaveWindow() {
    //Create Utility Services
    matrix_child = utilityProcess.fork(path.join(__dirname, './assets/util/ndarray_fnc'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'Matrix Utility Process'
    })

    jquery_child = utilityProcess.fork(path.join(__dirname, './assets/util/jquery_csv'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'JQuery Utility Process'
    })

    jacquardWeaveWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        //parent: calWindow,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: false, // to allow require
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'jacquard_preload.js')
        }
    })

    jacquardWeaveWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jacquard_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    jquery_child.on('message', (message) => {
        //send message back to jacquard renderer
        jacquardWeaveWindow.webContents.send('drawdown-update', message)

        //send message to matrix util to update drawdown matrix
        let matrixMessage = {
            type: 2,
            drawdown_matrix: message.drawdown_matrix,
        }
        matrix_child.postMessage(matrixMessage)
    })

    appWindows.push(jacquardWeaveWindow)

    // Emitted when the window is closed.
    jacquardWeaveWindow.on('closed', function() {
        matrix_child.kill()
        jquery_child.kill()
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

    /*
    activeSerialPort.open(function (err) {
        if (err) {
            return console.log('Error opening port: ', err.message)
        }
        else {
            //Because there's no callback to write, write errors will be emitted on the port:
            //port.write('main screen turn on')
            console.log('Serial Port Open on ', activeSerialPort.path, ' and baudrate: ', activeSerialPort.baudRate)
        }
    })
    */
}

//Inter-Process Communication
ipcMain.on('send-serial-port', openSerialConnetion)
ipcMain.handle('get-serial', async () => { return SerialPort.list()})
ipcMain.handle('cal-window', async () => {
    await app.isReady('ready', createCalWindow())
})
ipcMain.handle('shaft-window', async () => {
    await app.isReady('ready', createShaftWeaveWindow())
})

//Matrix Operations
ipcMain.on('create-array', (event, {row, col, id}) => {
    let message = {
        type: 0, 
        row: row, 
        col: col, 
        id: id,
        state: null
    }
    matrix_child.postMessage(message)
})
ipcMain.on('update-matrix', (event, {row, col, state, id}) => {
    let message = {
        type: 1, 
        row: row, 
        col: col, 
        id: id,
        state: state
    }
    matrix_child.postMessage(message)
})

//Read CSV File
ipcMain.on('read-file', (event, {filePath}) => {
    let message = {
        filePath: filePath 
    }
    jquery_child.postMessage(message)
})

// Initialize & Create
app.on('ready', () => {
    //createMainWindow()
    //createShaftWeaveWindow()
    createJacquardWeaveWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit()
})

// Re-create a window in the app when the dock icon is clicked
// & there are no other windows open.
/*
app.on('activate', function() {
    if (mainWindow === null) {
        createMainWindow()
    }
})
*/

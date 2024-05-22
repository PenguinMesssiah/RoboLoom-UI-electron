const { app, BrowserWindow, ipcMain, utilityProcess } = require('electron')
const path  = require('path')
const url   = require('url')
const List  = require("collections/list");
//const {Konva} = require("konva")


let mainWindow          = null
let shaftWeaveWindow    = null
let jacquardWeaveWindow = null
let matrix_child        = null
let jquery_child        = null
let serial_child        = null
let appWindows          = new List()

function createMainWindow() {
    //Create Utility Services
    serial_child = utilityProcess.fork(path.join(__dirname, './assets/util/serial_cmd'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'Serial Utility Process'
    })

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        backgroundColor: "#ccc",
        webPreferences: {
            nodeIntegration: false, // to allow require
            contextIsolation: true, // allow use with Electron 12+
            preload: path.join(__dirname, './assets/preload/preload.js')
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

    serial_child.on('message', (message) => {
        //send message back to main renderer
        mainWindow.webContents.send('post-serialPort-parse', message)
    })

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
            preload: path.join(__dirname, './assets/preload/cal_preload.js')
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
    //Create Utility Services
    matrix_child = utilityProcess.fork(path.join(__dirname, './assets/util/ndarray_fnc'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'Matrix Utility Process'
    })

    jquery_child = utilityProcess.fork(path.join(__dirname, './assets/util/jquery_fs'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'JQuery Utility Process'
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
            preload: path.join(__dirname, './assets/preload/shaft_preload.js')
        }
    })

    shaftWeaveWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'shaft_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    appWindows.push(shaftWeaveWindow)
   
    matrix_child.on('message', (msg) => {
        let type            = msg.type
        let drawdown_matrix = msg?.drawdown_matrix
        let rowToMove       = msg?.rowToMove

        switch(type) {
            case 0: //Send Drawdown to Shaft Renderer
                shaftWeaveWindow.webContents.send('drawdown-update', drawdown_matrix)
                break;
            case 1: //send message to serial util process
                let serial_msg = {
                    type: 3,
                    rowToMove: rowToMove
                }
                serial_child.postMessage(serial_msg)
                break;
            case 2: //Save Weave Draft to File
                msg.type = 1;
                jquery_child.postMessage(msg)
                break;
            case 3: //Load Weave Draft from File
                shaftWeaveWindow.webContents.send('load-from-file', msg)
                break;    
        } 
    })

    jquery_child.on('message', (msg) => {
        let type = msg.type 

        switch(type) {
            case 0: //Load Weave Draft (Send to FileData to ndArray)
                msg.type = 5
                matrix_child.postMessage(msg)
                break;
        }
    })

    // Emitted when the window is closed.
    shaftWeaveWindow.on('closed', function() {
        matrix_child.kill()
        jquery_child.kill()
    })
}

function createJacquardWeaveWindow() {
    //Create Utility Services
    matrix_child = utilityProcess.fork(path.join(__dirname, './assets/util/ndarray_fnc'), {
        stdio: ['ignore', 'inherit', 'inherit'],
        serviceName: 'Matrix Utility Process'
    })

    jquery_child = utilityProcess.fork(path.join(__dirname, './assets/util/jquery_fs'), {
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
            preload: path.join(__dirname, './assets/preload/jacquard_preload.js')
        }
    })

    jacquardWeaveWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'jacquard_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    matrix_child.on('message', (message) => {
        let type            = message.type
        let drawdown_matrix = message?.drawdown_matrix
        let rowToMove       = message?.rowToMove

        switch(type) {
            case 0: //send message back to shaft renderer
                shaftWeaveWindow.webContents.send('drawdown-update', drawdown_matrix)
                break;
            case 1: //send message to serial util process
                let msg = {
                    type: 3,
                    rowToMove: rowToMove
                }
                serial_child.postMessage(msg)
                break;
        } 
    })

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

//Inter-Process Communication
ipcMain.handle('cal-window', async () => {
    await app.isReady('ready', createCalWindow())
})
ipcMain.handle('shaft-window', async () => {
    await app.isReady('ready', createShaftWeaveWindow())
})
ipcMain.handle('jacquard-window', async () => {
    await app.isReady('ready', createJacquardWeaveWindow())
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

//Serial Commands
ipcMain.on('parse-serial-ports', async () => {
    let message = {
        type: 0
    }
    serial_child.postMessage(message)
})
ipcMain.on('send-motor-cmd', (event, {motorInt, dir}) => {
    let message = {
        type: 1,
        motorInt: motorInt,
        direction: dir
    }
    serial_child.postMessage(message)
})
ipcMain.on('send-autoCal-cmd', (event, {dir}) => {
    let message = {
        type: 2,
        direction: dir
    }
    serial_child.postMessage(message)
})
ipcMain.on('send-row-cmd', (event, {rowIndex}) => {
    let message = {
        type: 3,
        rowIndex: rowIndex
    }
    matrix_child.postMessage(message)
})

//JQuery & FS Commands
ipcMain.on('read-txt-file', (event, {filePath}) => {
    let message = {
        type: 0,
        filePath: filePath 
    }
    jquery_child.postMessage(message)
})
ipcMain.on('save-weave-draft', (event, {num_shafts, num_pedals}) => {
    let message = {
        type: 4,
        num_shafts: num_shafts,
        num_pedals: num_pedals
    }

    matrix_child.postMessage(message)
})

// Initialize & Create
app.on('ready', () => {
    //createMainWindow()
    //createCalWindow()
    createShaftWeaveWindow()
    //createJacquardWeaveWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    serial_child.kill()
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

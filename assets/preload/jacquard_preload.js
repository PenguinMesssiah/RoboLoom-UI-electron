const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('ndarray', {
    createArray: (row, col, id) => ipcRenderer.send('create-array', {row, col, id}),
    updateMatrix: (row, col, state, id) => ipcRenderer.send('update-matrix', {row, col, state, id}),
    onDrawdownUpdate: (callback) => ipcRenderer.on('drawdown-update', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('jquery', {
    readFile: (filePath) => ipcRenderer.send('read-CSV-file', {filePath})
})

contextBridge.exposeInMainWorld('serial', {
    sendRowCmd: (rowIndex) => ipcRenderer.send('send-row-cmd', {rowIndex}),
    onSerialDisconnect: (callback) => ipcRenderer.on('serial-disconnect', (_event, value) => callback(value)),
    onSerialReconnect: (callback) => ipcRenderer.on('serial-reconnect', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('app', {
    openCalibrationWindow: () => ipcRenderer.invoke('jacquard-to-cal-window'),
    openShaftWindow: () => ipcRenderer.invoke('jacquard-to-shaft-window'),
    openWorldOfWeaving: () => ipcRenderer.invoke('weavingWorld-window')
})
const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('ndarray', {
    createArray: (row, col, id) => ipcRenderer.send('create-array', {row, col, id}),
    updateMatrix: (row, col, state, id) => ipcRenderer.send('update-matrix', {row, col, state, id}),
    onDrawdownUpdate: (callback) => ipcRenderer.on('drawdown-update', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('serial', {
    sendRowCmd: (rowIndex) => ipcRenderer.send('send-row-cmd', {rowIndex}),
    onSerialDisconnect: (callback) => ipcRenderer.on('serial-disconnect', (_event, value) => callback(value)),
    onSerialReconnect: (callback) => ipcRenderer.on('serial-reconnect', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('fs', {
    readFile: (filePath) => ipcRenderer.send('read-txt-file', {filePath}),
    saveWeaveDraft: (num_shafts, num_pedals)   => ipcRenderer.send('save-weave-draft', {num_shafts, num_pedals}),
    onLoadFile: (callback) => ipcRenderer.on('load-from-file', (_event, value) => callback(value))
})


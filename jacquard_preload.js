const { contextBridge, ipcRenderer} = require('electron');

/*
contextBridge.exposeInMainWorld('ndarray', {
    createArray: (row, col, id) => ipcRenderer.send('create-array', {row, col, id}),
    updateMatrix: (row, col, state, id) => ipcRenderer.send('update-matrix', {row, col, state, id}),
    onDrawdownUpdate: (callback) => ipcRenderer.on('drawdown-update', (_event, value) => callback(value))
})
*/
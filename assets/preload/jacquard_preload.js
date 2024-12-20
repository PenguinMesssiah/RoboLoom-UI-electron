const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('ndarray', {
    createArray: (row, col, id) => ipcRenderer.send('create-array', {row, col, id}),
    updateMatrix: (row, col, state, id) => ipcRenderer.send('update-matrix', {row, col, state, id}),
    onDrawdownUpdate: (callback) => ipcRenderer.on('drawdown-update', (_event, value) => callback(value)),
    envokeDrawdownUpdate: () => ipcRenderer.send('envoke-drawdown-update')
})

contextBridge.exposeInMainWorld('jquery', {
    readFile: (filePath) => ipcRenderer.send('read-CSV-file', {filePath})
})

contextBridge.exposeInMainWorld('serial', {
    sendRowCmd: (rowIndex) => ipcRenderer.send('send-row-cmd', {rowIndex}),
    sendPlainWeave: (startValue) => ipcRenderer.send('send-plainWeave-cmd', {startValue}),
    onSerialDisconnect: (callback) => ipcRenderer.on('serial-disconnect', (_event, value) => callback(value)),
    onSerialReconnect: (callback) => ipcRenderer.on('serial-reconnect', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('app', {
    changeView: (oldFrame, newFrame) => ipcRenderer.send('change-view', {oldFrame, newFrame}),
    openWorldOfWeaving: () => ipcRenderer.invoke('weavingWorld-window')
})
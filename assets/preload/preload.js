// All of the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('serial', {
  parseSerialPorts: () => ipcRenderer.send('parse-serial-ports'),
  onPostSerialPortParse: (callback) => ipcRenderer.on('post-serialPort-parse', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('app', {
  changeView: (oldFrame, newFrame) => ipcRenderer.send('change-view', {oldFrame, newFrame})
})

window.addEventListener('DOMContentLoaded', () => {
    for (const versionType of['chrome', 'electron', 'node']) {
        document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
    }
})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  })
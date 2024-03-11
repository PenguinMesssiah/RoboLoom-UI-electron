// All of the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});

contextBridge.exposeInMainWorld('serial', {
  getSerial: () => ipcRenderer.invoke('get-serial'),
  sendSerialPath: (port) => ipcRenderer.send('send-serial-port', port)
})

contextBridge.exposeInMainWorld('activeWindows', {
  getCalWindow: () => ipcRenderer.invoke('cal-window'),
  getShaftWindow: () => ipcRenderer.invoke('shaft-window')
})

window.addEventListener('DOMContentLoaded', () => {
    for (const versionType of['chrome', 'electron', 'node']) {
        document.getElementById(`${versionType}-version`).innerText = process.versions[versionType]
    }

    document.getElementById('serialport-version').innerText = require('serialport/package').version  
})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  })
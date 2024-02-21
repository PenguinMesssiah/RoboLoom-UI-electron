// All of the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron')

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

  contextBridge.exposeInMainWorld('channels', {
    //exposed channels for communication b/w main & renderer processes
    getMainData: () => ipcRenderer.invoke('data')
  })
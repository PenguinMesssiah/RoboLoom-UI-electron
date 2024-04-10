// All of the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('activeWindows', {
  getShaftWindow: () => ipcRenderer.invoke('shaft-window'),
  getJacquardWindow: () => ipcRenderer.invoke('jacquard-window')
})
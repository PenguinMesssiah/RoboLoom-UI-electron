// All of the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('app', {
  changeView: (oldFrame, newFrame) => ipcRenderer.send('change-view', {oldFrame, newFrame})
})

contextBridge.exposeInMainWorld('serial', {
  sendMotorCmd: (motorInt, dir) => ipcRenderer.send('send-motor-cmd', {motorInt, dir}),
  setMotorPosCmd: (motorInt, dir) => ipcRenderer.send('set-motor-pos-cmd', {motorInt, dir}),
  sendAutoCalCmd: (dir) => ipcRenderer.send('send-autoCal-cmd', {dir})
})

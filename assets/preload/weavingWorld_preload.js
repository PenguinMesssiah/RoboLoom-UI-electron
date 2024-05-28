const { contextBridge, ipcRenderer} = require('electron');

/*
contextBridge.exposeInMainWorld('app', {
    openCalibrationWindow: () => ipcRenderer.invoke('shaft-to-cal-window'),
    openJacquardWindow: () => ipcRenderer.invoke('shaft-to-jacquard-window')
})
*/
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
openDashboard: () => ipcRenderer.send('open-dashboard'),
  toggleSharing: (enabled) => ipcRenderer.send('toggle-sharing', enabled),
  startMiningWithThreads: (threads) => ipcRenderer.send('start-mining-with-threads', threads),
  onMinerLog: (callback) => ipcRenderer.on('miner-log', (_, data) => callback(data)),
  onSharingStatus: (callback) => ipcRenderer.on('sharing-status', (_, status) => callback(status)),
});

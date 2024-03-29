const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('months', {
  get: () => ipcRenderer.invoke('months:get')
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('theme', {
  light: () => ipcRenderer.invoke('theme:light'),
  dark: () => ipcRenderer.invoke('theme:dark'),
  system: () => ipcRenderer.invoke('theme:system'),
  get: () => ipcRenderer.invoke('theme:get')
})

contextBridge.exposeInMainWorld('idGen', {
  gen: () => ipcRenderer.invoke('idGen:gen')
})

contextBridge.exposeInMainWorld('dbMember', {
  create: async (data) => await ipcRenderer.invoke('dbMember:create', data),
  getAll: async () => await ipcRenderer.invoke('dbMember:getAll')
})

contextBridge.exposeInMainWorld('dbTithe', {
  create: async (data) => await ipcRenderer.invoke('dbTithe:create', data)
})

contextBridge.exposeInMainWorld('dbOffer', {
  create: async (data) => await ipcRenderer.invoke('dbOffer:create', data)
})

contextBridge.exposeInMainWorld('dbExpenseCategory', {
  create: async (data) => await ipcRenderer.invoke('dbExpenseCategory:create', data),
  getByName: async (name) => await ipcRenderer.invoke('dbExpenseCategory:getByName', name),
  getAll: async () => await ipcRenderer.invoke('dbExpenseCategory:getAll')
})

contextBridge.exposeInMainWorld('dbExpense', {
  create: async (data) => await ipcRenderer.invoke('dbExpense:create', data)
})

import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
  })
  contextBridge.exposeInMainWorld('electron', {
    processDocument: (filePath) => ipcRenderer.invoke('process-document', filePath),
    exportResponse: (data) => ipcRenderer.invoke('export-response', data)
  })
} catch (error) {
  console.error(error)
}

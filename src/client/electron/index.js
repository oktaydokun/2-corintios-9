const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

function createApp () {
  const createWindow = () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.loadFile(path.join(__dirname, '../index.html'))
    win.setIcon(path.join(__dirname, '../assets/logo.png'))

    // Menu.setApplicationMenu(null)

    ipcMain.handle('theme:light', () => {
      nativeTheme.themeSource = 'light'
      return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('theme:dark', () => {
      nativeTheme.themeSource = 'dark'
      return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('theme:system', () => {
      nativeTheme.themeSource = 'system'
    })
  }

  return {
    run: () => {
      app.whenReady().then(() => {
        createWindow()

        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
          }
        })
      }).catch(err => {
        console.log(err)
      })

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })
    }
  }
}

module.exports = {
  createApp
}

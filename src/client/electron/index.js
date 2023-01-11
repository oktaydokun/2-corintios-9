const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const fs = require('fs')

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
      fs.writeFileSync(path.join(__dirname, 'theme.txt'), 'light')
    })

    ipcMain.handle('theme:dark', () => {
      nativeTheme.themeSource = 'dark'
      fs.writeFileSync(path.join(__dirname, 'theme.txt'), 'dark')
    })

    ipcMain.handle('theme:system', () => {
      nativeTheme.themeSource = 'system'
      fs.writeFileSync(path.join(__dirname, 'theme.txt'), 'system')
    })

    ipcMain.handle('theme:get', () => {
      const theme = fs.readFileSync(path.join(__dirname, 'theme.txt'), 'utf8')
      nativeTheme.themeSource = theme || 'system'
      return theme || 'system'
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

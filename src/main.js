const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1366,
    height: 768
  })

  win.loadFile(path.join(__dirname, 'client/index.html'))
  win.setIcon(path.join(__dirname, 'client/assets/logo.png'))
}

app.whenReady().then(() => {
  createWindow()
}).catch(err => {
  console.log(err)
})

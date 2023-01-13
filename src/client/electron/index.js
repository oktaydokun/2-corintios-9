const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')
const fs = require('fs')
const prisma = require('../../server')

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

    ipcMain.handle('months:get', () => {
      const months = fs.readFileSync(
        path.join(__dirname, '../utils/months.txt'),
        'utf8'
      ).trimEnd()
      return months.split('\n')
    })

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

    ipcMain.handle('idGen:gen', () => {
      const id = (Date.now() * Math.round(Math.random() * (999 - 1) + 1)).toString(8)
      return id
    })

    // Member crud handles
    ipcMain.handle('dbMember:create', async (event, ...args) => {
      prisma.member.create({
        data: args[0]
      })
        .finally(async () => {
          await prisma.$disconnect()
        })
    })

    ipcMain.handle('dbMember:getAll', async () => {
      return await prisma.member.findMany()
    })

    // Tithe crud handles
    ipcMain.handle('dbTithe:create', async (event, ...args) => {
      prisma.tithe.create({
        data: args[0]
      })
        .finally(async () => {
          await prisma.$disconnect()
        })
    })

    // Offer crud handles
    ipcMain.handle('dbOffer:create', async (event, ...args) => {
      prisma.offer.create({
        data: args[0]
      })
        .finally(async () => {
          await prisma.$disconnect()
        })
    })

    // ExpenseCategory crud handles
    ipcMain.handle('dbExpenseCategory:create', async (event, ...args) => {
      prisma.expenseCategory.create({
        data: args[0]
      })
        .finally(async () => {
          await prisma.$disconnect()
        })
    })

    ipcMain.handle('dbExpenseCategory:getByName', async (event, ...args) => {
      const categories = await prisma.expenseCategory.findMany({
        select: {
          name: true,
          id: false
        }
      })

      const categoryAlreadyExists = categories.some(
        category => category.name.toLocaleLowerCase() === args[0].toLocaleLowerCase()
      )

      return categoryAlreadyExists
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

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import ytDownload from '../handlers/ytDownload.handler'
import '../handlers/utils.handler'
const MAIN_WINDOW_VITE_DEV_SERVER_URL: string = "";
const MAIN_WINDOW_VITE_NAME: string = "";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST


// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow: BrowserWindow | null = null
// Here, you can also use other preload

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'icon.icns'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Test actively push message to the Electron-Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // ipcMain Handlers
  ytDownload(mainWindow)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null
  }
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})



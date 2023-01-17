import {app, session} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import * as path from 'path';
import * as os from 'os';

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch(e => console.error('Failed create window:', e));

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
if (import.meta.env.DEV) {
 const reactDevToolsPath = path.join(os.homedir(), 'AppData/local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.27.1_0');

 app.whenReady().then(async () => {
   await session.defaultSession.loadExtension(reactDevToolsPath);
 }).catch(e => console.error('Failed install react devtools:', e));
}

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(module => {
      const autoUpdater =
        module.autoUpdater ||
        // @ts-expect-error Hotfix for https://github.com/electron-userland/electron-builder/issues/7338
        (module.default.autoUpdater as (typeof module)['autoUpdater']);
      return autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(e => console.error('Failed check updates:', e));
}

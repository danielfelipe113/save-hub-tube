import { ipcMain, shell } from 'electron';

// IPC handler to open a file
ipcMain.handle('open-file', (event, filePath) => {
	shell.openPath(filePath);
});

// IPC handler to open a folder containing the file
ipcMain.handle('open-folder', (event, filePath) => {
	shell.showItemInFolder(filePath);
});

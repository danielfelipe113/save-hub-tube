import { ipcMain, BrowserWindow, app } from "electron";
import { runYtDlp } from '../services/ytDlp'
export default (mainWindow: BrowserWindow) => {
	ipcMain.handle('download-file', (_, data: {url: string, id: string}) => {
		const ytDlpSpawn = runYtDlp(data.url);
		
		let jsonOutput = ''

		ytDlpSpawn.stdout.on('data', (data) => {
			jsonOutput += data.toString();
		});
	
		ytDlpSpawn.stderr.on('data', (data) => {
			const output = data.toString();
			
			// Parse the progress from the output.
			const match = output.match(/(\d+\.\d+)%/);
			if (match) {
				const progress = parseFloat(match[1]);
				
				// Send the progress to the renderer process.
				mainWindow.webContents.send('download-progress', {
					id: data.id,
					progress
				});
			}
		});

		ytDlpSpawn.on('close', (code) => {
			const downloadsPath = app.getPath('downloads');
			if (code !== 0) {
				mainWindow.webContents.send('download-failed', data.id);
			} else {
				try {
					const jsonData = JSON.parse(jsonOutput);
					const filePath = `${downloadsPath}/${jsonData.title}.${jsonData.ext}`;
					mainWindow.webContents.send('download-success', {
						id: data.id,
						metadata: {
							downloadedFilePath: filePath,
							...jsonData
						}
					});
				} catch (err) {
					mainWindow.webContents.send('download-failed', data.id);
				}
			}
		})

		
		return 'Download started'
	})

	
}



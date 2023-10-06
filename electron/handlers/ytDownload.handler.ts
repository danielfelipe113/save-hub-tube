import { ipcMain, BrowserWindow, app } from "electron";
import { fork } from 'child_process';
import { join, dirname } from 'node:path'

export default (mainWindow: BrowserWindow) => {
	const ytDlpSpawns = new Map();
	const downloadsPath = app.getPath('downloads');
	
	ipcMain.handle('cancel-download', (_, candidate) => {
		ytDlpSpawns.get(candidate.id).kill('SIGTERM');
	})

	ipcMain.handle('download-file', (_, candidate: {url: string, id: string, simulate: boolean}) => {
		let ytdlpWrapperPath;
		let ytdlpBinPath;

		if(app.isPackaged) {
			ytdlpWrapperPath = join(__dirname, 'ytDlpWrapper.js');
			ytdlpBinPath = join(process.resourcesPath, 'bin');
		} else {
			ytdlpWrapperPath = join(__dirname, 'ytDlpWrapper.js');
			ytdlpBinPath = join(app.getAppPath(), 'electron/bin');
		}


		ytDlpSpawns.set(candidate.id, fork(ytdlpWrapperPath, [
			candidate.url,
			downloadsPath,
			candidate.simulate ? '1' : '0',
			ytdlpBinPath
		]));
		
		
		let jsonOutput = ''

		ytDlpSpawns.get(candidate.id).on('message', (message: any) => {
			if (message.type === 'stdout') {
				
			
				try {
					const progressJson = JSON.parse(message.data.toString());
					if(Object.keys(progressJson).indexOf('progress_percentage') !== -1) {
						mainWindow.webContents.send('download-progress', {
							id: candidate.id,
							progress: Number(progressJson.progress_percentage.trim().replace('%', ''))
						});
					}
					console.log(`yt-dlp stdout: ${message.data}`, candidate.id);
				} catch(error) {
					jsonOutput += message.data.toString();
				}
			} else if (message.type === 'stderr') {
				console.log(`ytdlp stderr: ${message.data}`);
				const output = message.data.toString();
				
				// Parse the progress from the output.
				const match = output.match(/(\d+\.\d+)%/);
				if (match) {
					const progress = parseFloat(match[1]);
					
					// Send the progress to the renderer process.
					mainWindow.webContents.send('download-progress', {
						id: candidate.id,
						progress
					});
				}
			} else if (message.type === 'close') {
				console.log('yt-dlp exited with code:', message.code);
				const downloadsPath = app.getPath('downloads');
				if (message.code !== 0) {
					mainWindow.webContents.send('download-failed', {id: candidate.id, code: message.code});
				} else {
					try {
						const jsonData = JSON.parse(jsonOutput);
						const filePath = `${downloadsPath}/${jsonData.title}.${jsonData.ext}`;
						mainWindow.webContents.send('download-success', {
							id: candidate.id,
							wasSimulated: candidate.simulate,
							metadata: {
								downloadedFilePath: filePath,
								...jsonData
							}
						});
					} catch (err) {
						mainWindow.webContents.send('download-failed', candidate.id);
					}
				}
			}
		});
		return 'Download started'
		ytDlpSpawns.get(candidate.id).stdout.on('data', (data: any) => {
			console.log(`yt-dlp stdout: ${data}`);
			
			try {
				const progressJson = JSON.parse(data.toString());
				if(Object.keys(progressJson).indexOf('progress_percentage') !== -1) {
					mainWindow.webContents.send('download-progress', {
						id: candidate.id,
						progress: Number(progressJson.progress_percentage.trim().replace('%', ''))
					});
				}
			} catch(error) {
				jsonOutput += data.toString();
			}

		});
	
		ytDlpSpawns.get(candidate.id).stderr.on('data', (data: any) => {
			console.log(`ytdlp stderr: ${data}`);
			const output = data.toString();
			
			// Parse the progress from the output.
			const match = output.match(/(\d+\.\d+)%/);
			if (match) {
				const progress = parseFloat(match[1]);
				
				// Send the progress to the renderer process.
				mainWindow.webContents.send('download-progress', {
					id: candidate.id,
					progress
				});
			}
		});

		ytDlpSpawns.get(candidate.id).on('close', (code: any) => {
			console.log('yt-dlp exited with code:', code);
			const downloadsPath = app.getPath('downloads');
			if (code !== 0) {
				mainWindow.webContents.send('download-failed', candidate.id);
			} else {
				try {
					const jsonData = JSON.parse(jsonOutput);
					const filePath = `${downloadsPath}/${jsonData.title}.${jsonData.ext}`;
					mainWindow.webContents.send('download-success', {
						id: candidate.id,
						metadata: {
							downloadedFilePath: filePath,
							...jsonData
						}
					});
				} catch (err) {
					mainWindow.webContents.send('download-failed', candidate.id);
				}
			}
		})

		
		return 'Download started'
	})

	
}



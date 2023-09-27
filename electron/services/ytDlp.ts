import { spawn } from 'child_process';
import { app } from 'electron';

/**
 * Run yt-dlp with the provided URL.
 * @param url - The URL to be processed by yt-dlp.
 * @returns A promise that resolves with the output from yt-dlp or rejects with an error.
 */
export function runYtDlp(url: string) {
	console.log(`Starting setup to downloading ${url}`)
	const downloadsPath = app.getPath('downloads');
	const outputTemplate = `${downloadsPath}/%(title)s.%(ext)s`;
	// const command = `yt-dlp --print-json -o "${outputTemplate}" ${url}`;
	const ytDlp = spawn('yt-dlp', ['--print-json', '-o', outputTemplate, url]);

	return ytDlp;
	// return new Promise((resolve, reject) => {
	// 	exec(command, (error, stdout, stderr) => {
	// 		if (error) {
	// 			console.log(`There was an error with download ${url}`)
	// 			reject(new Error('yt-dlp is not installed or there was an error executing it.'));
	// 			return;
	// 		}
	// 		const jsonData = JSON.parse(stdout);
	// 		const filePath = `${downloadsPath}/${jsonData.title}.${jsonData.ext}`;
	// 		console.log(`${url} downloaded in ${filePath}`)
	// 		resolve(filePath);
	// 	});
	// });
}







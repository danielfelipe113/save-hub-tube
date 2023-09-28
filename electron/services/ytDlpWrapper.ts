const { spawn } = require('child_process');

let ytdlpBinary;
const path = require('path');
const os = require('os');



switch (os.platform()) {
    case 'win32':
        ytdlpBinary = 'yt-dlp.exe';
        break;
    case 'darwin':
        ytdlpBinary = 'yt-dlp';
        break;
    case 'linux':
        ytdlpBinary = 'yt-dlp_linux';
        break;
    default:
        throw new Error('Unsupported platform');
}


const url = process.argv[2];
const downloadsPath = process.argv[3];
const simulate = process.argv[4];
const ytdlpBinFolderPath = process.argv[5];

const ytdlpPath = path.normalize(path.join(ytdlpBinFolderPath, ytdlpBinary));

const isSimulation = simulate && Number(simulate) === 1;
if(isSimulation && Number(simulate) === 1) {
	console.log(`Fetching details of ${url}`)
} else {
	console.log(`Starting setup to download ${url}`)
}

const outputTemplate = `${downloadsPath}/%(title)s.%(ext)s`;
const ytDlpParams = ['--newline', '--verbose', '--q', '--progress', '--progress-template', '{"progress_percentage":"%(progress._percent_str)s"}', '--print-json', '-o', outputTemplate, url];

if(isSimulation) {
	ytDlpParams.push('--simulate');
}

const ytDlp = spawn(ytdlpPath, ytDlpParams);

console.log(`Download started ${url}`)
ytDlp.stdout.on('data', (data) => {
	process.send({ type: 'stdout', data: data.toString() });
});

ytDlp.stderr.on('data', (data) => {
	process.send({ type: 'stderr', data: data.toString() });
});

ytDlp.on('close', (code) => {
	process.send({ type: 'close', code });
});

ytDlp.on('error', (err) => {
	console.error('Error occurred:', err.message);
});

ytDlp.on('exit', (code, signal) => {
	console.log(`Child process exited with code ${code} and signal ${signal}`);
});






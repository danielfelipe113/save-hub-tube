const fs = require('fs');
const path = require('path');

module.exports = async function afterPack(context) {
	const appOutDir = context.appOutDir;
	const ytdlpPathWindows = path.join(appOutDir, 'bin', 'yt-dlp.exe');
	const ytdlpPathMac = path.join(appOutDir, 'bin', 'yt-dlp');
	const ytdlpPathLinux = path.join(appOutDir, 'bin', 'yt-dlp_linux');

	if (fs.existsSync(ytdlpPathWindows)) {
		fs.chmodSync(ytdlpPathWindows, '755');
	}

	if (fs.existsSync(ytdlpPathMac)) {
		fs.chmodSync(ytdlpPathMac, '755');
	}

	if (fs.existsSync(ytdlpPathLinux)) {
		fs.chmodSync(ytdlpPathLinux, '755');
	}
}

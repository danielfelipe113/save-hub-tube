"use strict";
const { spawn } = require("child_process");
let ytdlpBinary;
const path = require("path");
const os = require("os");
switch (os.platform()) {
  case "win32":
    ytdlpBinary = "yt-dlp.exe";
    break;
  case "darwin":
    ytdlpBinary = "yt-dlp";
    break;
  case "linux":
    ytdlpBinary = "yt-dlp_linux";
    break;
  default:
    throw new Error("Unsupported platform");
}
const url = process.argv[2];
const downloadsPath = process.argv[3];
const simulate = process.argv[4];
const ytdlpBinFolderPath = process.argv[5];
const ytdlpPath = path.normalize(path.join(ytdlpBinFolderPath, ytdlpBinary));
const isSimulation = simulate && Number(simulate) === 1;
if (isSimulation && Number(simulate) === 1) {
  console.log(`Fetching details of ${url}`);
} else {
  console.log(`Starting setup to download ${url}`);
}
const outputTemplate = `${downloadsPath}/%(title)s.%(ext)s`;
const ytDlpParams = ["--newline", "--verbose", "--q", "--progress", "--progress-template", '{"progress_percentage":"%(progress._percent_str)s"}', "--print-json", "-o", outputTemplate, url];
if (isSimulation) {
  ytDlpParams.push("--simulate");
}
const ytDlp = spawn(ytdlpPath, ytDlpParams);
console.log(`Download started ${url}`);
ytDlp.stdout.on("data", (data) => {
  process.send({ type: "stdout", data: data.toString() });
});
ytDlp.stderr.on("data", (data) => {
  process.send({ type: "stderr", data: data.toString() });
});
ytDlp.on("close", (code) => {
  process.send({ type: "close", code });
});
ytDlp.on("error", (err) => {
  console.error("Error occurred:", err.message);
});
ytDlp.on("exit", (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieXREbHBXcmFwcGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi9lbGVjdHJvbi9zZXJ2aWNlcy95dERscFdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBzcGF3biB9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuXG5sZXQgeXRkbHBCaW5hcnk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuXG5cblxuc3dpdGNoIChvcy5wbGF0Zm9ybSgpKSB7XG4gICAgY2FzZSAnd2luMzInOlxuICAgICAgICB5dGRscEJpbmFyeSA9ICd5dC1kbHAuZXhlJztcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGFyd2luJzpcbiAgICAgICAgeXRkbHBCaW5hcnkgPSAneXQtZGxwJztcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGludXgnOlxuICAgICAgICB5dGRscEJpbmFyeSA9ICd5dC1kbHBfbGludXgnO1xuICAgICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHBsYXRmb3JtJyk7XG59XG5cblxuY29uc3QgdXJsID0gcHJvY2Vzcy5hcmd2WzJdO1xuY29uc3QgZG93bmxvYWRzUGF0aCA9IHByb2Nlc3MuYXJndlszXTtcbmNvbnN0IHNpbXVsYXRlID0gcHJvY2Vzcy5hcmd2WzRdO1xuY29uc3QgeXRkbHBCaW5Gb2xkZXJQYXRoID0gcHJvY2Vzcy5hcmd2WzVdO1xuXG5jb25zdCB5dGRscFBhdGggPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oeXRkbHBCaW5Gb2xkZXJQYXRoLCB5dGRscEJpbmFyeSkpO1xuXG5jb25zdCBpc1NpbXVsYXRpb24gPSBzaW11bGF0ZSAmJiBOdW1iZXIoc2ltdWxhdGUpID09PSAxO1xuaWYoaXNTaW11bGF0aW9uICYmIE51bWJlcihzaW11bGF0ZSkgPT09IDEpIHtcblx0Y29uc29sZS5sb2coYEZldGNoaW5nIGRldGFpbHMgb2YgJHt1cmx9YClcbn0gZWxzZSB7XG5cdGNvbnNvbGUubG9nKGBTdGFydGluZyBzZXR1cCB0byBkb3dubG9hZCAke3VybH1gKVxufVxuXG5jb25zdCBvdXRwdXRUZW1wbGF0ZSA9IGAke2Rvd25sb2Fkc1BhdGh9LyUodGl0bGUpcy4lKGV4dClzYDtcbmNvbnN0IHl0RGxwUGFyYW1zID0gWyctLW5ld2xpbmUnLCAnLS12ZXJib3NlJywgJy0tcScsICctLXByb2dyZXNzJywgJy0tcHJvZ3Jlc3MtdGVtcGxhdGUnLCAne1wicHJvZ3Jlc3NfcGVyY2VudGFnZVwiOlwiJShwcm9ncmVzcy5fcGVyY2VudF9zdHIpc1wifScsICctLXByaW50LWpzb24nLCAnLW8nLCBvdXRwdXRUZW1wbGF0ZSwgdXJsXTtcblxuaWYoaXNTaW11bGF0aW9uKSB7XG5cdHl0RGxwUGFyYW1zLnB1c2goJy0tc2ltdWxhdGUnKTtcbn1cblxuY29uc3QgeXREbHAgPSBzcGF3bih5dGRscFBhdGgsIHl0RGxwUGFyYW1zKTtcblxuY29uc29sZS5sb2coYERvd25sb2FkIHN0YXJ0ZWQgJHt1cmx9YClcbnl0RGxwLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG5cdHByb2Nlc3Muc2VuZCh7IHR5cGU6ICdzdGRvdXQnLCBkYXRhOiBkYXRhLnRvU3RyaW5nKCkgfSk7XG59KTtcblxueXREbHAuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcblx0cHJvY2Vzcy5zZW5kKHsgdHlwZTogJ3N0ZGVycicsIGRhdGE6IGRhdGEudG9TdHJpbmcoKSB9KTtcbn0pO1xuXG55dERscC5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuXHRwcm9jZXNzLnNlbmQoeyB0eXBlOiAnY2xvc2UnLCBjb2RlIH0pO1xufSk7XG5cbnl0RGxwLm9uKCdlcnJvcicsIChlcnIpID0+IHtcblx0Y29uc29sZS5lcnJvcignRXJyb3Igb2NjdXJyZWQ6JywgZXJyLm1lc3NhZ2UpO1xufSk7XG5cbnl0RGxwLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT4ge1xuXHRjb25zb2xlLmxvZyhgQ2hpbGQgcHJvY2VzcyBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX0gYW5kIHNpZ25hbCAke3NpZ25hbH1gKTtcbn0pO1xuXG5cblxuXG5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxFQUFFLE1BQVUsSUFBQSxRQUFRLGVBQWU7QUFFekMsSUFBSTtBQUNKLE1BQU0sT0FBTyxRQUFRLE1BQU07QUFDM0IsTUFBTSxLQUFLLFFBQVEsSUFBSTtBQUl2QixRQUFRLEdBQUcsU0FBWSxHQUFBO0FBQUEsRUFDbkIsS0FBSztBQUNhLGtCQUFBO0FBQ2Q7QUFBQSxFQUNKLEtBQUs7QUFDYSxrQkFBQTtBQUNkO0FBQUEsRUFDSixLQUFLO0FBQ2Esa0JBQUE7QUFDZDtBQUFBLEVBQ0o7QUFDVSxVQUFBLElBQUksTUFBTSxzQkFBc0I7QUFDOUM7QUFHQSxNQUFNLE1BQU0sUUFBUSxLQUFLLENBQUM7QUFDMUIsTUFBTSxnQkFBZ0IsUUFBUSxLQUFLLENBQUM7QUFDcEMsTUFBTSxXQUFXLFFBQVEsS0FBSyxDQUFDO0FBQy9CLE1BQU0scUJBQXFCLFFBQVEsS0FBSyxDQUFDO0FBRXpDLE1BQU0sWUFBWSxLQUFLLFVBQVUsS0FBSyxLQUFLLG9CQUFvQixXQUFXLENBQUM7QUFFM0UsTUFBTSxlQUFlLFlBQVksT0FBTyxRQUFRLE1BQU07QUFDdEQsSUFBRyxnQkFBZ0IsT0FBTyxRQUFRLE1BQU0sR0FBRztBQUNsQyxVQUFBLElBQUksdUJBQXVCLEdBQUcsRUFBRTtBQUN6QyxPQUFPO0FBQ0UsVUFBQSxJQUFJLDhCQUE4QixHQUFHLEVBQUU7QUFDaEQ7QUFFQSxNQUFNLGlCQUFpQixHQUFHLGFBQWE7QUFDdkMsTUFBTSxjQUFjLENBQUMsYUFBYSxhQUFhLE9BQU8sY0FBYyx1QkFBdUIsdURBQXVELGdCQUFnQixNQUFNLGdCQUFnQixHQUFHO0FBRTNMLElBQUcsY0FBYztBQUNoQixjQUFZLEtBQUssWUFBWTtBQUM5QjtBQUVBLE1BQU0sUUFBUSxNQUFNLFdBQVcsV0FBVztBQUUxQyxRQUFRLElBQUksb0JBQW9CLEdBQUcsRUFBRTtBQUNyQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FBUztBQUN6QixVQUFBLEtBQUssRUFBRSxNQUFNLFVBQVUsTUFBTSxLQUFLLFlBQVk7QUFDdkQsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTO0FBQ3pCLFVBQUEsS0FBSyxFQUFFLE1BQU0sVUFBVSxNQUFNLEtBQUssWUFBWTtBQUN2RCxDQUFDO0FBRUQsTUFBTSxHQUFHLFNBQVMsQ0FBQyxTQUFTO0FBQzNCLFVBQVEsS0FBSyxFQUFFLE1BQU0sU0FBUyxLQUFNLENBQUE7QUFDckMsQ0FBQztBQUVELE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUTtBQUNsQixVQUFBLE1BQU0sbUJBQW1CLElBQUksT0FBTztBQUM3QyxDQUFDO0FBRUQsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLFdBQVc7QUFDbEMsVUFBUSxJQUFJLGtDQUFrQyxJQUFJLGVBQWUsTUFBTSxFQUFFO0FBQzFFLENBQUM7In0=

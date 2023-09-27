import { app, contextBridge, ipcMain, ipcRenderer } from "electron"
import { useLoading } from "../services/useLoader"



export function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
	return new Promise((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve(true)
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true)
				}
			})
		}
	})
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find(e => e === child)) {
			return parent.appendChild(child)
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find(e => e === child)) {
			return parent.removeChild(child)
		}
	},
}

const loadingElements = useLoading()
function appendLoading() {
	safeDOM.append(document.head, loadingElements.oStyle)
	safeDOM.append(document.body, loadingElements.oDiv)
}

function removeLoading() {
	safeDOM.remove(document.head, loadingElements.oStyle)
	safeDOM.remove(document.body, loadingElements.oDiv)
}


domReady().then(appendLoading)
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.invoke(channel, data),
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  hideLoading: () => {
    removeLoading()
  }
});

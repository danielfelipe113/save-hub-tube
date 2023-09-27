interface ElectronAPI {
	send: (channel: string, data: any) => Promise<any>;
	on: (channel: string, callback: (event, ...args) => void) => Promise<any>;
	hideLoading: () => void;
}

interface Window {
	electron: ElectronAPI;
}
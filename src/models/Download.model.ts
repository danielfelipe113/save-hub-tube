export class DownloadModel {
	id: string = '';
	url: string = '';
	progress: number = 0;
	status: DownloadStatusEnum = DownloadStatusEnum.NOT_STARTED;
	metadata: {
		downloadedFilePath: string;
		[key: string]: any;
	} | null

	constructor(id: string, url: string) {
		this.id = id;
		this.url = url;
		this.metadata = null;
	}
}

export enum DownloadStatusEnum {
	STARTED = 'STARTED',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	NOT_STARTED = 'NOT_STARTED',
	IN_PROGRESS = 'IN_PROGRESS'
}
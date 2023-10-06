export class CandidateModel {
	id: string = '';
	url: string = '';
	progress: number = 0;
	status: DownloadStatusEnum = DownloadStatusEnum.PENDING;
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
	CANCELLED = 'CANCELLED',
	PENDING = 'PENDING',
	READY_TO_DOWNLOAD = 'READY_TO_DOWNLOAD',
	IN_PROGRESS = 'IN_PROGRESS',
	FETCHING_DETAILS = 'FETCHING_DETAILS'
}
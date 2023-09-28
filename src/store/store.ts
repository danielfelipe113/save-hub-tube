import { defineStore } from 'pinia'
import { Ref, computed, ref, watch } from 'vue'
import { CandidateModel, DownloadStatusEnum } from '@/models/Candidate.model'
import { toast, ToastType, type ToastOptions } from 'vue3-toastify';


export const useGlobalStore = defineStore('global', () => {
	const downloadCandidates: Ref<{[key: string]: CandidateModel}> = ref({})
	const queueUrls: Ref<string[]> = ref([])

	const approvedDomains = ['www.youtube.com'];
	const downloadStarted = ref(false);
	
	const candidatesLength = computed(() => {
		return Object.keys(downloadCandidates.value).length
	})

	const candidatesPending = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.PENDING || candidate.status === DownloadStatusEnum.FETCHING_DETAILS;
		});
	});

	const areCandidatesReadyToDownload = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.PENDING;
		}).length === 0;
	})

	const downloadFinished = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.COMPLETED || candidate.status === DownloadStatusEnum.FAILED;
		}).length === Object.keys(downloadCandidates.value).length;
	})

	const successfulDownloaded = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.COMPLETED;
		});
	})

	const failedDownloaded = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.FAILED;
		});
	})

	const candidatesBeingDownloaded = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.IN_PROGRESS || candidate.status === DownloadStatusEnum.STARTED;
		});
	})

	const candidatesDetailsBeingFetched = computed(() => {
		return Object.values(downloadCandidates.value).filter((candidate) => {
			return candidate.status === DownloadStatusEnum.FETCHING_DETAILS;
		});
	})

	watch([downloadFinished], () => {
		if(downloadFinished.value) {
			showNotification('Download completed', 'All files have been downloaded')
		}
	})

	watch([candidatesPending], () => {
		if(candidatesPending.value.length > 0) {
			downloadStarted.value = true;
		} else {
			downloadStarted.value = false;
		}
	})

	watch([candidatesBeingDownloaded], () => {
		if(candidatesBeingDownloaded.value.length > 0) {
			downloadStarted.value = true;
			document.body.style.cursor = 'progress';
		} else {
			downloadStarted.value = false;
			document.body.style.cursor = 'default';
		}
	});

	function showToast(message: string, type?: ToastType) {
		toast(message, {
			theme: toast.THEME.DARK,
			pauseOnHover: false,
			position: toast.POSITION.BOTTOM_RIGHT,
			type: type,
		  } as ToastOptions);
	}

	function showNotification(title: string, body?: string, cb?: () => void) {
		const notification = new window.Notification(title, {
			body: body
		})
		if(cb) {
			notification.onclick = cb;
		} else {
			notification.onclick = () => {
				const downloadedFilePath = successfulDownloaded.value[0]?.metadata?.downloadedFilePath;
				if(downloadedFilePath) {
					window.electron.send('open-folder', downloadedFilePath);
				}
			};
		}
	}

	function openFile(candidate: CandidateModel) {
		window.electron.send('open-file', candidate.metadata?.downloadedFilePath)
	}

	function openFileFolder(candidate: CandidateModel) {
		window.electron.send('open-folder', candidate.metadata?.downloadedFilePath)
	}


	function downloadAll() {
		if(candidatesBeingDownloaded.value.length > 0) {
			showToast('Already downloading', toast.TYPE.WARNING)
			return
		}
		
		if(candidatesDetailsBeingFetched.value.length > 0) {
			showToast('Preparing download, please wait a moment', toast.TYPE.WARNING)
			return
		}

		for (const key in downloadCandidates.value) {
			const candidate = downloadCandidates.value[key];
			if(candidate.status === DownloadStatusEnum.READY_TO_DOWNLOAD) {
				downloadFile(candidate);
			}
		}
	}

	function downloadFile(candidate: CandidateModel, independantDownload = false) {
		if(!candidate.url) {
			console.error('File url cannot be empty')
			return;
		}
		if(candidate.status === DownloadStatusEnum.PENDING) {
			showToast('Preparing download, please wait a moment', toast.TYPE.WARNING)
			return
		}
		if(candidate.status !== DownloadStatusEnum.READY_TO_DOWNLOAD) {
			showToast('Download in progress', toast.TYPE.WARNING)
			return
		}

		window.electron.send('download-file', {
			url: candidate.url,
			id: candidate.id
		})
			.then(() => {
				console.log('Download started', candidate.id)
				downloadCandidates.value[candidate.id].status = DownloadStatusEnum.STARTED;
			})

		window.electron.on('download-progress', (data: {
			id: string,
			progress: number
		}) => {
			console.log('download-progress', data)
			if(downloadCandidates.value[data.id]) {
				downloadCandidates.value[data.id].progress = data.progress;
				downloadCandidates.value[data.id].status = DownloadStatusEnum.IN_PROGRESS;
			}
		})

		window.electron.on('download-failed', (data: {id: string, code: string}) => {
			console.log('download-failed', data.code)
			
			if(downloadCandidates.value[data.id]) {
				downloadCandidates.value[data.id].progress = 0;
				downloadCandidates.value[data.id].status = DownloadStatusEnum.FAILED;
			}
		})

		window.electron.on('download-success', (data: {
				id: string,
				filePath: string,
				metadata: any
			}) => {
			console.log('download-success', data)
			if(downloadCandidates.value[data.id]) {
				downloadCandidates.value[data.id].progress = 100;
				downloadCandidates.value[data.id].status = DownloadStatusEnum.COMPLETED;
				downloadCandidates.value[data.id].metadata = data.metadata;

				if(independantDownload) {
					showToast('Download completed', toast.TYPE.SUCCESS)
				}
			}
		})
	}

	function fetchFileDetailsWithoutDownload(candidate: CandidateModel) {
		if(!candidate.url) {
			console.error('File url cannot be empty')
			return;
		}
		downloadCandidates.value[candidate.id].status = DownloadStatusEnum.FETCHING_DETAILS;
		window.electron.send('download-file', {
			url: candidate.url,
			id: candidate.id,
			simulate: true
		})
			.then(() => {
				console.log('Fetching candidate details', candidate.id)
			})

			window.electron.on('download-success', (data: {
					id: string,
					filePath: string,
					metadata: any
				}) => {
				console.log('download-success', data)
				if(downloadCandidates.value[data.id]) {
					downloadCandidates.value[data.id].progress = 0;
					downloadCandidates.value[data.id].status = DownloadStatusEnum.READY_TO_DOWNLOAD;
					downloadCandidates.value[data.id].metadata = data.metadata;
				}
			})
	}

	return {
		// State
		downloadCandidates,
		queueUrls,
		approvedDomains,
		downloadStarted,
		// Computed
		candidatesPending,
		candidatesLength,
		successfulDownloaded,
		failedDownloaded,
		downloadFinished,
		candidatesBeingDownloaded,
		areCandidatesReadyToDownload,
		candidatesDetailsBeingFetched,
		// Methods
		showToast,
		downloadAll,
		downloadFile,
		openFile,
		openFileFolder,
		fetchFileDetailsWithoutDownload,
		showNotification
	 }
})
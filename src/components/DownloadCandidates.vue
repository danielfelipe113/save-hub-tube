<template>
	<div class="relative mt-2 not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
		<div class="overflow-x-auto">
			<table class="table table-">
				<!-- head -->
				<thead>
				<tr>
					<!-- <th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th> -->
					<th></th>
					<th>Title</th>
					<th>URL</th>
					<th>Progress</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
					<tr v-for="(candidate, key, idx) in globalStore.downloadCandidates" :key="candidate.id">
						<!-- <th>
							<label>
								<input type="checkbox" class="checkbox" />
							</label>
						</th> -->
						<td>
							{{ Number(idx) + 1 }}
						</td>
						<td>
							<div class="flex items-center space-x-3">
								<div class="avatar" v-if="candidate.metadata">
									<div class="mask mask-squircle w-12 h-12">
										<img :src="candidate.metadata.thumbnail" alt="Avatar Tailwind CSS Component" />
									</div>
								</div>
								<div>
									<div class="font-bold" v-if="candidate.metadata">{{ candidate.metadata.title }}</div>
									<div class="font-bold font-italic" v-else-if="candidate.status === DownloadStatusEnum.STARTED">Starting...</div>
									<div class="font-bold font-italic" v-else-if="candidate.status === DownloadStatusEnum.IN_PROGRESS">Downloading...</div>
									<div class="font-bold font-italic" v-else>Pending...</div>

								</div>
							</div>
						</td>
						<td>
							<div class="flex align-center justify-center">
								<div class="truncate" style="max-width: 150px">
									{{ candidate.url }}
								</div>
								<button class="button tooltip" data-tip="Copy to Clipboard" @click.prevent="copyToClipboard(candidate.url)">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
									</svg>
								</button>
							</div>
						</td>
						<td>
							<div class="radial-progress text-primary" :style="'--value:' + candidate.progress + ';--size:3rem;--thickness:5%'" v-if="true">{{candidate.progress}}%</div>
						</td>
						<td>
							<div class="join" role="group">
								<template v-if="candidate.status === DownloadStatusEnum.COMPLETED">
									<button class="btn join-item tooltip" data-tip="Open File" @click.prevent="globalStore.openFile(candidate)">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
										</svg>
									</button>
									<button class="btn join-item tooltip" data-tip="Open Folder" @click.prevent="globalStore.openFileFolder(candidate)">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
										</svg>
									</button>
								</template>
								<template v-else>
									<button class="btn join-item tooltip" data-tip="Download" @click.prevent="globalStore.downloadFile(candidate, true)">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
										</svg>
									</button>
									<button class="btn join-item tooltip" data-tip="Remove from Queue" @click.prevent="removeFromQueue(candidate.id)">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								</template>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/store/store';
import { toast } from 'vue3-toastify';
import { DownloadStatusEnum } from '@/models/Candidate.model';


const globalStore = useGlobalStore();

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text)
		.then(() => {
			globalStore.showToast('Copied to clipboard', toast.TYPE.SUCCESS);
		})
		.catch(() => {
			globalStore.showToast('Failed to copy to clipboard', toast.TYPE.ERROR);
		})
}

function removeFromQueue(candidateId: string) {
	globalStore.cancelDownload(globalStore.downloadCandidates[candidateId]).then(() => {
		delete globalStore.downloadCandidates[candidateId];
		globalStore.showToast('Download removed from queue', toast.TYPE.INFO);
	});
}

</script>@/models/Candidate.model
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { DownloadModel } from '../models/Download.model'

export const useGlobalStore = defineStore('global', () => {
	const downloading: Ref<{[key: string]: DownloadModel}> = ref({})
	
	return { 
		downloading
	 }
})
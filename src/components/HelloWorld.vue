<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="onCountChange">count is {{ count }}</button>
    <button type="button" @click="downloadFiles">Download files</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX {{ uuidv4() }}
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { DownloadModel, DownloadStatusEnum } from '@/models/Download.model';
import { useGlobalStore } from '@/store/store'
defineProps<{ msg: string }>()

const globalState = useGlobalStore();
const fileUrls = ref<string[]>([
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
]);
const count = ref(0);

function openFile(filePath: string) {
 window.electron.send('open-file', filePath)
}

function openFileFolder(filePath: string) {
  window.electron.send('open-folder', filePath)
}

function onCountChange() {
  count.value++
}

function downloadFiles() {
  fileUrls.value.forEach((fileUrl) => {
    downloadFile(fileUrl);
  })
}

function downloadFile(fileUrl: string) {
  if(!fileUrl) {
    console.error('File url cannot be empty')
    return;
  }
  // Send the request to the backend
  const newDownload = new DownloadModel(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    uuidv4()
  );

  window.electron.send('download-file', {
    url: newDownload.url,
    id: newDownload.id
  })
    .then(() => {
      newDownload.status = DownloadStatusEnum.STARTED;
      globalState.downloading[newDownload.id] = newDownload;
      console.log('Download started')
    })

  window.electron.on('download-progress', (data: {
    id: string,
    progress: number
  }) => {
    console.log('download-progress', data)
    if(globalState.downloading[data.id]) {
      globalState.downloading[data.id].progress = data.progress;
      globalState.downloading[data.id].status = DownloadStatusEnum.IN_PROGRESS;
    }
  })

  window.electron.on('download-failed', (id: string) => {
    console.log('download-failed', id)
    if(globalState.downloading[id]) {
      globalState.downloading[id].progress = 0;
      globalState.downloading[id].status = DownloadStatusEnum.FAILED;
    }
  })

  window.electron.on('download-success', (data: {
      id: string,
      filePath: string,
      metadata: any
    }) => {
    console.log('download-success', data)
    if(globalState.downloading[data.id]) {
      globalState.downloading[data.id].progress = 100;
      globalState.downloading[data.id].status = DownloadStatusEnum.COMPLETED;
      globalState.downloading[data.id].metadata = data.metadata;
    }
  })
}


</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

import {createRouter, createWebHistory} from 'vue-router'
import ImageImport from '../views/ImageImport.vue'
import DefectRecognition from '../views/DefectRecognition.vue'
import ImageQuery from '../views/ImageQuery.vue'
import DataInspect from '../views/DataInspect.vue'
import BatchList from '../views/BatchList.vue'
import ImageViewer from "@/components/ImageViewer.vue"
import VideoInspect from '@/views/VideoInspect.vue'
import MainMenu from '@/views/MainMenu.vue'

const routes = [
    {path: '/', name: 'Home', redirect: '/image-import'},
    {path: '/main-menu', name: 'MainMenu', component: MainMenu},
    {path: '/image-import', name: 'ImageImport', component: ImageImport},
    {
        path: '/defect-recognition', children: [
            {path: 'batch-list', name: 'BatchList', component: BatchList},
            {path: 'detect/:batchId', name: 'Detect', component: DefectRecognition, props: true},
        ], redirect: '/defect-recognition/batch-list'
    },
    {path: '/data-video-inspect', name: 'DataVideoInspect', component: VideoInspect},
    {
        path: '/data-query', children: [
            {path: 'image-query', name: 'ImageQuery', component: ImageQuery},
            {path: 'image/:imageId', name: 'Image', component: ImageViewer, props: true},
        ], redirect: '/data-query/image-query'
    },
    {path: '/data-inspect', name: 'DataInspect', component: DataInspect}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
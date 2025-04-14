import {createRouter, createWebHistory} from 'vue-router'
import ImageImport from '../views/ImageImport.vue'
import DefectRecognition from '../views/DefectRecognition.vue'
import DataQuery from '../views/DataQuery.vue'
import DataInspect from '../views/DataInspect.vue'
import BatchList from '../views/BatchList.vue'

const routes = [
    {path: '/', name: 'Home', redirect: '/image-import'},
    {path: '/image-import', name: 'ImageImport', component: ImageImport},
    {
        path: '/defect-recognition', children: [
            {path: 'batch-list', name: 'BatchList', component: BatchList},
            {path: 'detect/:batchId', name: 'Detect', component: DefectRecognition, props: true},
        ], redirect: '/defect-recognition/batch-list'
    },
    {path: '/data-query', name: 'DataQuery', component: DataQuery},
    {path: '/data-inspect', name: 'DataInspect', component: DataInspect}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
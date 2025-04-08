import {createRouter, createWebHistory} from 'vue-router'
import ImageImport from '../views/ImageImport.vue'
import DefectRecognition from '../views/DefectRecognition.vue'
import DataQuery from '../views/DataQuery.vue'
import ReportGeneration from '../views/ReportGeneration.vue'

const routes = [
    {path: '/image-import', name: 'ImageImport', component: ImageImport},
    {path: '/defect-recognition', name: 'DefectRecognition', component: DefectRecognition},
    {path: '/data-query', name: 'DataQuery', component: DataQuery},
    {path: '/report-generation', name: 'ReportGeneration', component: ReportGeneration}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
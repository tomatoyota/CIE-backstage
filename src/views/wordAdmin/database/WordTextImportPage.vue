<template>
    <div class=" vh-100">
        <!-- 第一步 -->
            <div
            class="drop-area mb-4"
            v-if="!uploadImageComponent && !excelFile"
            >
                <v-icon icon="mdi mdi-file-upload-outline" size="80px" class="mb-4" color="#42A5F5"></v-icon>
                <p> <span @click="uploadedFile()">點此</span> 選擇檔案</p>
                <input ref="fileInput" type="file" style="display: none;" accept=".csv, .xlsx" @change="handleFileUpload">
            </div>

        <!-- 第二步
        <template v-if="excelFile && uploadProgress < 100">
            <div
            class="drop-area mb-4"
            >
                <img :src="uploadAnimation" class="mb-4 uploadAnimation">
                <p>請勿關閉視窗，不然上傳進度將會取消</p>
            </div>
            <div class="w-50 mx-auto mb-4">
                <v-progress-linear :model-value="uploadProgress" height="7" color="#42A5F5"></v-progress-linear>
                <div class="d-flex mt-2">
                    <p class="w-50 fileName">{{ fileName }}</p>
                    <p class="w-50 text-end progress">{{ uploadProgress }}%</p>
                </div>
            </div>
        </template> -->

        <!-- 第三步 -->
        <template v-if="uploadImageComponent">
            <div
            class="drop-area mb-4"
            >
                <v-icon icon="mdi mdi-check-bold" size="80px" class="mb-4" color="#42A5F5"></v-icon>
                <p>上傳資料格式無誤<br>是否要批次新增圖檔?</p>
                <div class="buttonGroup mt-4">
                    <v-btn flat class="mr-2" to="/admin/dataEdit">否，上傳字詞就好</v-btn>
                    <v-btn flat color="#42A5F5" @click="batchUploadImage()">是</v-btn>
                </div>
            </div>
            <!-- <div class="w-50 mx-auto mb-4">
                <v-progress-linear :model-value="uploadProgress" height="7" color="#42A5F5"></v-progress-linear>
                <div class="d-flex mt-2">
                    <p class="w-50 fileName">{{ fileName }}</p>
                    <p class="w-50 text-end progress">{{ uploadProgress }}%</p>
                </div>
            </div>         -->
        </template>

        <!-- 如果有出錯 -->
        <div class="buttonGroup" :class="error ? 'text-left' : 'text-center'" v-if="!uploadImageComponent">
            <v-btn class="mr-2" flat color="normal" to="/admin/dataEdit">返回編輯區</v-btn>
            <v-btn flat color="#1976D2" @click.prevent="clearErrorData" v-if="error">重新上傳</v-btn>
        </div>
        <template v-if="error">
            <errorComponent :errorData="errorData" :error-msg="errorMsg" @clean-error="cleanError"></errorComponent>
        </template>
        
        <LoadingComponent :loading="loading"/>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useTabsStore } from '@/stores/Tabs.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as XLSX from 'xlsx';
import uploadAnimation from '@/assets/images/uploadAnimation.gif';
import errorComponent from '@/components/uploadExcelErrorComponent.vue';
import importSrv from '@/service/import.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    components:{
        errorComponent,
        LoadingComponent,
    },
    data() {
        return {
            excelFile: null,
            excelData: null,
            uploadAnimation: uploadAnimation,
            uploadProgress: 0,
            uploadImageComponent: false,
            fileName: '',
            errorData:[],
            errorMsg: '',
            error: false,
            loading: false,
        };
    },
    
    mounted(){
    },
    methods:{
        uploadedFile(){
            this.$refs.fileInput.click();
        },
        handleFileUpload(event){
            const file = event.target.files[0]
            this.excelFile = file
            this.fileName = file.name
            const formData = new FormData
            formData.append('csvFile', file)
            formData.append('ignoreErrors', false)
            this.importWords(formData)
        },
        setHeaderTab(){
            const tabsStore = useTabsStore();
            const { tabsList } = storeToRefs(tabsStore);
            const routerTo = '/admin/importPage'
            const matchTab =  tabsList.value.find(title => title.title === '編輯區')
            matchTab.to = routerTo
        },
        // 跳過新增圖檔直接上傳
        importWords(formData) {
            this.loading = true;
            importSrv.importWordFile(formData).then((res) => {
                this.loading = false
                if (res.data.rtnCode === '400') {
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    });
                    const originalErrorData = res.data.data.errorRows
                    const errorData = [];
                    let authError = ''
                    let statusError = ''
                    originalErrorData.forEach(i => {
                        if(i.authError !== ''){
                            authError = i.authError
                        }
                        if(i.statusError !== ''){
                            statusError = i.statusError
                        }
                        i.rows.forEach(j => {
                            if(j.errColumns){
                                for(let k = 1; k <= 14; k++){
                                    let colIndex = j.errColumns.findIndex(col => col.col === k);
                                    if(colIndex === -1){
                                        j.errColumns.push({
                                            col: k,
                                            errMsg: '',
                                            originalInput: '',
                                        });
                                    }
                                }
                                j.errColumns.sort((a, b) => a.col - b.col);
                            }
                            if(i.authError !== '' || i.statusError !== ''){
                                if(j.errColumns){
                                    for(let k = 1; k <= 15; k++){
                                        let colIndex = j.errColumns.findIndex(col => col.col === k);
                                        if(colIndex === -1){
                                            j.errColumns.push({
                                                col: k,
                                                errMsg: '',
                                                originalInput: '',
                                            }); 
                                        }
                                        if(k === 14){
                                            const errorItem = {
                                                col: k,
                                                authError: authError,
                                                statusError: statusError,
                                                originalInput: '',
                                            }
                                            j.errColumns[14] = errorItem
                                        }
                                    }
                                }else{
                                    const errColumnsAry = {
                                        row: j.row,
                                        errColumns: []
                                    }
                                    for(let k = 1; k <= 15; k++){
                                        errColumnsAry.errColumns.push({
                                            col: k,
                                            errMsg: '',
                                            originalInput: '',
                                        }); 
                                        if(k === 14){
                                            const errorItem = {
                                                col: k,
                                                authError: authError,
                                                statusError: statusError,
                                                originalInput: '',
                                            }
                                            errColumnsAry.errColumns[14] = errorItem
                                        }
                                    }
                                    i.rows.push(errColumnsAry)
                                }
                            }
                        })
                        errorData.push(i);
                    });
                    this.errorData = errorData
                    this.error = true;
                }else{
                    this.loading = false
                    this.uploadImageComponent = true
                }
            })
        },
        // 清除所有資訊，重新上傳
        clearErrorData() {
            this.uploadImageComponent = false
            this.errorData = []
            this.excelFile = null
            this.fileName = ''
            this.error = false
        },
        batchUploadImage(){
            this.$router.push('/admin/uploadImage')
        }
    },
}

</script>
<style lang="scss">
.drop-area {
    width: 50%;
    margin: auto;
    border: 2px dashed #1565C0;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    background-color: #E3F2FD;

    p{
        margin-bottom: 0px;
        span{
            color: #42A5F5;
            font-weight: 900;
            cursor: pointer;
        }
    }
}
.vh-100{
    min-height: calc(100vh - 50px);
}
a{
    text-decoration: none;
    color: inherit;
}
.uploadAnimation{
    width: 100px;
}
.fileName{
    font-weight: 900;
    font-size: 0.875rem;
}
.progress{
    color: #42A5F5;
    font-weight: 900;
    font-size: 1rem;
}
</style>
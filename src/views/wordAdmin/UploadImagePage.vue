<template>
    <div class=" vh-100">

        <!-- 第一步 -->
        <v-row class="mb-2" v-if="imageErrorData.allData.length === 0">
            <v-col cols="2">
                <h4><strong>第一步、上傳 Excel 檔</strong></h4>
            </v-col>
            <v-col cols="10">
                <v-file-input
                v-model="excelFile"
                label="上傳 Excel 檔案"
                variant="outlined"
                bg-color="white"
                @change="uploadExcel(index)"
                accept=".xlsx, .csv"
                hide-details
                ></v-file-input>
                <span v-if="hasExcel === true && hasError === false" class="smallText">檔案沒有問題 <v-icon icon="mdi mdi-check" color="success"></v-icon></span>
            </v-col>
        </v-row>
        <excelErrorComponent v-if="errorData.length > 0" :errorData="errorData"></excelErrorComponent>

        <!-- 第二步 -->
        <v-row v-if="imageErrorData.allData.length === 0">
            <v-col cols="2">
                <h4><strong>第二步、上傳圖片</strong></h4>
            </v-col>
            <v-col cols="10">
                <div
                class="drop-area mb-4"
                :class="hasExcel === true && hasError === false ? '' : 'disabled'"
                >
                    <v-icon icon="mdi mdi-file-upload-outline" size="80px" class="mb-4" :color="hasExcel === true && hasError === false ? '#42A5F5' : '#DADADA'"></v-icon>
                    <p><span :class="hasExcel === true && hasError === false ? '' : 'disabled'" @click="uploadImageFiles()">點此</span> 選擇圖片檔案</p>
                    <input ref="fileInput" type="file" multiple style="display: none;" @change="imagesUpload()" accept="image/jpeg,image/png,image/gif">
                </div>
                <div class="text-center">
                    <v-btn class="mr-4" color="#F5F5F5" flat @click="previousPage()">回列表頁</v-btn>
                    <v-btn v-if="hasExcel === true && hasError === true" color="primary" flat @click="clearPage()">重新上傳</v-btn>
                </div>
            </v-col>
        </v-row>
        <imageErrorComponent :imageErrorData="imageErrorData" v-if="imageErrorData.allData.length > 0" @uploadImage="batchUploadImage" @previouspage="previousPage" @clearPage="clearPage"></imageErrorComponent>
        <LoadingComponent :loading="loading"/>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
// import { useImagedbStore } from '@/stores/BatchImageDatabase.js';
import batchImageSrv from '@/service/batchImage.js'
import excelErrorComponent from '@/components/batchImage/excelErrorComponent.vue';
import imageErrorComponent from '@/components/batchImage/imageErrorComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { useTabsStore } from '@/stores/Tabs.js';

export default {
    components:{
        excelErrorComponent,
        LoadingComponent,
        imageErrorComponent,
    },
    data() {
        return {
            excelFile: [],
            excelData: null,
            // uploadAnimation: uploadAnimation,
            uploadProgress: 0,
            excelData: [],
            headers: [
                { title: '項次', align: 'start', sortable: false, key: 'index', width: '10%' },
                { title: '字詞名', align: 'start', sortable: false, key: 'word', width: '20%' },
                { title: '圖檔名稱', align: 'start', sortable: false, key: 'fileName', width: '20%' },
                { title: '圖片說明', align: 'start', sortable: false, key: 'fileName', width: '15%' },
                { title: '圖片來源', align: 'start', sortable: false, key: 'fileName', width: '15%' },
                { title: '錯誤說明', align: 'start', sortable: false, key: 'image', width: '20%' },
            ],
            items: [],
            loading: false,
            hasExcel: false,
            errorData:[],
            hasError: false,
            loading: false,
            imageFiles: [],
            imageFileName:[],
            imageErrorData: {
                correctData: [],
                errorData: [],
                allData: []
            },
            origin: '',
            tableItems: [],
        };
    },
    created(){
        const store = useImagedbStore();
        const { imageErrorData, errorData, excelFile, tableItems } = storeToRefs(store);
        if(tableItems){
            this.tableItems = tableItems
        }
        if(imageErrorData.value){
            this.imageErrorData = imageErrorData
        }
        if(excelFile.value && excelFile.value.length > 0){
            this.excelFile = excelFile
            this.hasExcel = true
        }
        if(errorData.value.length === 0 && imageErrorData.value.allData.length > 0){
            this.hasError = false
        }
        if(errorData.value.length > 0){
            this.errorData = errorData
            this.hasError = true
        }
    },
    watch: {
        'imageErrorData': {
            handler(newValue) {
                const store = useImagedbStore();
                store.updateImageErrorData(newValue);
            },
            deep: true,
        },
        'errorData': {
            handler(newValue) {
                const store = useImagedbStore();
                store.updateExcelErrorData(newValue);
            },
            deep: true,
        },
        'excelFile': {
            handler(newValue) {
                const store = useImagedbStore();
                store.updateExcelFile(newValue);
            },
            deep: true,
        },
        'tableItems': {
            handler(newValue) {
                const store = useImagedbStore();
                store.updateTableItems(newValue);
            },
            deep: true,
        },
    },
    mounted(){
        this.checkOrigin()
    },
    methods: {
        previousPage(){
            this.errorData = []
            this.excelFile = []
            this.imageErrorData = {
                correctData: [],
                errorData: [],
                allData: []
            },
            this.$router.push('/admin/imageDatabase')
        },
        checkOrigin(){
            const origin = localStorage.getItem('origin')
            this.origin = origin
            localStorage.removeItem('origin')
        },
        clearPage(){
            this.excelFile = []
            this.imageErrorData = {
                correctData: [],
                errorData: [],
                allData: []
            },
            this.errorData = []
            this.hasError = false
            this.hasExcel = false
            this.imageFileName = []
        },
        uploadExcel(){
            const file = event.target.files[0]
            const formData = new FormData();
            formData.append('csvFile', file)
            this.loading = true
            batchImageSrv.uploadExcel(formData).then((res) => {
                if(res.data.rtnCode === '0000'){
                    this.tableItems = res.data.data
                    this.paginations = res.data.pagination
                    this.hasExcel = true
                    this.hasError = false
                    this.loading = false
                    this.errorData = []
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                    const originalErrorData = res.data.data.errorRows
                    const errorData = [];
                    originalErrorData.forEach(i => {
                        i.rows.forEach(j => {
                            for(let k = 1; k <= 5; k++){
                                let colIndex = j.errColumns.findIndex(col => col.col === k);
                                if(colIndex === -1){
                                    if(k !== 5){
                                        j.errColumns.push({
                                            col: k,
                                            errMsg: '',
                                            originalInput: 'ok',
                                        });
                                    }else if(k === 5){
                                        j.errColumns.push({
                                            col: k,
                                            errMsg: '',
                                            originalInput: '',
                                            statusError: i.statusError,
                                            authError: i.authError
                                        });
                                    }
                                }
                            }
                            j.errColumns.sort((a, b) => a.col - b.col);
                        })
                        errorData.push(i);
                    });
                    this.errorData = errorData
                    this.hasError = true
                    this.loading = false
                }
            })
        },
        uploadImageFiles(){
            this.$refs.fileInput.click();
        },
        imagesUpload(){
            const files = Array.from(event.target.files)
            this.imageFiles = files
            files.forEach(i => {
                this.imageFileName.push(i.name)
            })
            this.tidyImageExcel()
        },
        tidyImageExcel(){
            let imageFiles = this.imageFileName
            let tempImageFilesAry = imageFiles
            const excelData = this.tableItems
            const imageErrorData = {
                correctData: [],
                errorData: [],
                allData: []
            }
            excelData.wordList.forEach(i => {
                i.defs.forEach(d => {
                    if(typeof d.images === 'object'){
                        // 判斷是否一個釋義有多張圖片
                        let multiMatch = []
                        d.images.forEach(j => {
                            // 把找不到的圖片先丟到 ary 裡面
                            if (!imageFiles.includes(j)) {
                                multiMatch.push(j)
                            }
                        })
                        const imageItem = {
                            row: d.row,
                            wordText: i.wordText,
                            errorInfo: '',
                            sequences: d.sequences,
                            images: d.images,
                            imageInfo: d.imageInfo,
                            imageSource: d.imageSource
                        }
                        if(multiMatch.length === 0){
                            imageErrorData.correctData.push(imageItem)
                            tempImageFilesAry = tempImageFilesAry.filter(image => !d.images.includes(image));
                        }else{
                            const multiMatchStr = multiMatch.join('、')
                            imageItem.errorInfo = '未找到以下圖片' + multiMatchStr
                            imageErrorData.errorData.push(imageItem)
                        }
                        imageErrorData.allData.push(imageItem)
                    }else{
                        // 判斷是否有單張圖片
                        const imageItem = {
                            row: d.row,
                            wordText: i.wordText,
                            errorInfo: '',
                            sequences: d.sequences,
                            images: d.images,
                            imageInfo: d.imageInfo,
                            imageSource: d.imageSource
                        }
                        if (imageFiles.includes(d.images)) {
                            imageErrorData.correctData.push(imageItem)
                            tempImageFilesAry = tempImageFilesAry.filter(image => image !== d.images);
                        }else {
                            imageItem.errorInfo = '字詞未找到對應圖片'
                            imageErrorData.errorData.push(imageItem)
                        }
                        imageErrorData.allData.push(imageItem)
                    }
                    
                });
            });
            tempImageFilesAry.forEach(i => {
                const errorItem = {
                    word: '',
                    images: i,
                    errorInfo: '圖片未找到對應字詞'
                }
                imageErrorData.errorData.push(errorItem)
                imageErrorData.allData.push(errorItem)
            
            })
            this.imageErrorData = imageErrorData

        },
        batchUploadImage() {
            this.loading = true
            const formData = new FormData();
            const correctData = JSON.stringify(this.tableItems.wordList)
            this.imageFiles.forEach(i => {
                const encodedFileName = encodeURIComponent(i.name);
                const file = new File([i], encodedFileName, { type: i.type });
                formData.append('media', file);
            });
            
            formData.append('wordList', correctData);
            batchImageSrv.batchUploadImage(formData).then((res) => {
                this.loading = false
                if (!res.isSuccess) {
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        dismissButtonColor: '#e3e3e3',
                        dismissButtonRText: '回列表頁',
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '重新上傳',
                        background: '#F0F0F2',
                        width: 400
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.clearPage()
                        }
                    });
                    return
                };
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    position: 'center',
                    title: this.origin === 'audio' ? `${res.data.rtnMsg}` : `${res.data.rtnMsg}，是否要繼續上傳音檔`,
                    showConfirmButton: this.origin === 'audio' ? false : true,
                    showCancelButton: true,
                    reverseButtons: true,
                    confirmButtonColor: '#0E2A34',
                    confirmButtonText: '是，繼續上傳音檔',
                    cancelButtonText: '回列表頁',
                    width: 500,
                    background: '#F0F0F2',
                    padding: 25
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.clearPage()
                        this.setTabs()
                    }else if(result.isDismissed){
                        this.clearPage()
                        this.$router.push('/admin/imageDatabase')
                    }
                });
            });
        },
        
        setTabs(){
            const tab = {
                title: '聲音檔資料庫管理',
                name: 'SoundFileDb',
                to: '/admin/soundFileDb',
                permissionId: '',
            }
            const origin = this.origin
            localStorage.setItem('origin', origin)
            const tabsStore = useTabsStore();
            tabsStore.setTabsList(tab);
            tab.type === 'external' ? '' : this.$router.push({ name: tab.name, query: { action: 'reset' }});
        }
    },
}

</script>
<style lang="scss">
.drop-area {
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

            &.disabled{
                color: #D8D8D8;
            }
        }
    }
    &.disabled{
        border: 2px solid #D8D8D8;
        background-color: #F2F2F2;
    }
}
a{
    text-decoration: none;
    color: inherit;
}
.uploadAnimation{
    width: 100px;
}
.progress{
    color: #42A5F5;
    font-weight: 900;
    font-size: 1rem;
}
.vh-100{
    min-height: calc(100vh - 48px);
}
.imageResultFilter{
    .itemLength{
        background-color: red;
        color: white;
        padding: 4px;
        border-radius: 100px;
        margin-left: 5px;
    }
}
.v-table{
    table{
        tbody{
            tr{
                &.red{
                    *{
                    color: red;
                    }
                }
                td{
                    img{
                        max-height: 150px;
                    }
                }
            }
        }
    }
}

.smallText{
    font-size: 14px;
    color: #6d6d6d;
    padding-left: 40px;
    padding-top: 15px;
}


</style>
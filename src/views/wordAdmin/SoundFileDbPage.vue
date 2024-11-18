<template>
    <div class="">
        <v-form>
            <v-row class="py-4">
                <v-col cols="3" class="py-2">
                    <v-text-field v-model="searchCondition.wordText" variant="outlined" label="字詞名" hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-select
                    label="顯示筆數"
                    :items="listAmount"
                    v-model="selectedListAmount"
                    variant="outlined"
                    hide-details
                    ></v-select>
                </v-col>
                <v-col cols="3" class="d-flex offset-3">
                    <v-col class="py-0 pl-0">
                        <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
                    </v-col>
                    <v-col class="py-0 pr-0">
                        <v-btn class="w-100" flat color="success" @click="searchAudio(1)">搜尋</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-7 d-flex align-end justify-space-between">
            <v-row class="align-center" no-gutters>
                <p class="mb-0" v-if="paginations.totalItems">共{{ paginations.totalItems }}筆</p>
                <v-col>
                    <PaginationComponent :pageLength="paginations.totalPages" :current-page="paginations.currentPage" @get-list="searchAudio" @set-page="setPage"></PaginationComponent>
                </v-col>
            </v-row>
            
            <div class="ms-auto">
                <v-btn class="mr-2" flat color="#1976D2" @click="uploadAudio()">音檔上傳</v-btn>
                <v-btn class="mr-2" variant="flat" color="#1976D2" @click="exportAudio()" :disabled="checkItem.length === 0">匯出</v-btn>
            </div>
        </div>
        
        <v-table class="mt-4">
            <thead>
                <tr>
                    <th class="text-left">
                        <v-checkbox hide-details v-model="checkAllItem" @click.prevent="checkCheckbox"></v-checkbox>
                    </th>
                    <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
                        <a href="#" class="text-decoration-none text-darkprimary d-flex align-center" @click.prevent="sortDBList(header)" :class="header.value !== '' ? '' : 'noCursor'">
                            {{ header.title }}
                            <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'ASC'"></v-icon>
                            <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'DESC'"></v-icon>
                        </a>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(rowItem, index) in tableItems">
                    <template v-for="(item, itemIndex) in rowItem.defs">
                        <tr v-for="(imageItem, imageItemIndex) in item.audios">
                            <td width="7%">
                                <v-checkbox v-model="checkItem" :value="imageItem.voiceId" hide-details></v-checkbox>
                            </td>
                            <td v-if="imageItemIndex === 0" :rowspan="item.audios.length" :class="item.audios.length > 1 ? 'side-borders' : ''">{{ rowItem.wordText }}</td>
                            <td v-if="imageItemIndex === 0" :rowspan="item.audios.length" :class="item.audios.length > 1 ? 'side-borders' : ''">{{ item.sequence }}</td>
                            <td>{{ decodeURIComponent(imageItem.originalFileName) }}</td>
                            <td>{{ formatDate(imageItem.updatedAt) }}</td>
                            <td>{{ imageItem.creator }}</td>
                            <td>
                                <a href="#" @click.prevent="previewAudio(rowItem, rowItem.defs[itemIndex].audios[0], rowItem.defs[itemIndex].sequence)">
                                    <v-tooltip text="預覽音檔" location="bottom">
                                        <template v-slot:activator="{ props }">
                                            <v-icon v-bind="props" class="mdi mdi-file-eye-outline me-2" x-large></v-icon>
                                        </template>
                                    </v-tooltip>
                                </a>
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </v-table>
        <LoadingComponent :loading="loading"/>
        <v-dialog v-model="previewAudioDialog" width="800px">
            <previewAudioComponent :previewData="previewData" @closeDialog="previewAudioDialog = false"></previewAudioComponent>
        </v-dialog>
        
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
// import { useAudiodbStore } from '@/stores/BatchAudioDatebase.js';
import PaginationComponent from '@/components/PaginationComponent.vue';
import batchAudioSrv from '@/service/batchAudio.js'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useRoute } from 'vue-router';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import previewAudioComponent from '@/components/batchAudio/previewAudioComponent.vue';
import JSZip from 'jszip'
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    components: { 
        previewAudioComponent,
        PaginationComponent,
        LoadingComponent,
    },
    data() {
        return {
            searchCondition:{
                wordText: '',
                sortBy: '',
                sortDirection: '',
                page: 1,
                pageSize: 10,
            },
            checkItem: [],
            checkAllItem: false,
            editDialog: false,
            tableItems: [],
            sortBy: '',
            sortOrder: '',
            paginations: {
                currentPage: 1,
                totalCount: 0,
                totalPages: 1,
                totalItems: 0
            },
            loading: false,
            headers:[
                {
                    title: '字詞名',
                    value: 'word_text',
                    sort: '',
                    width: '20%'
                },
                {
                    title: '義項序',
                    value: '',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '音檔名稱',
                    value: 'image_name',
                    sort: '',
                    width: '30%'
                },
                {
                    title: '音檔上傳時間',
                    value: '',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '音檔上傳者',
                    value: '',
                    sort: '',
                    width: '10%'
                },
                {
                    title: '',
                    value: '',
                    sort: '',
                    width: '10%'
                },
            ],
            toEditInputOptions: {
                rangeSeparator: ''
            },
            pagePermissions:[],
            previewAudioDialog: false,
            previewData: null,
            listAmount:[10,50,200,500],
            selectedListAmount: 50,
        };
    },
    created() {
        const store = useAudiodbStore();
        const { searchCondition, editViewTableItem, paginations, checkItem, audioErrorData, errorData, excelFile } = storeToRefs(store);
        // 搜尋欄位狀態儲存
        if(searchCondition){
            this.searchCondition = searchCondition
        }
        // table 狀態儲存
        if(editViewTableItem){
            this.tableItems = editViewTableItem
        }
        if(paginations){
            this.paginations = paginations
        }
        if(errorData && errorData.value.length > 0){
            this.$router.push('/admin/uploadAudio')
        }
        if(excelFile.value.length > 0){
            this.$router.push('/admin/uploadAudio')
        }
        if(audioErrorData && audioErrorData.allData && audioErrorData.value.allData.length > 0){
            this.$router.push('/admin/uploadAudio')
        }

      
    },
    watch: {
        searchCondition: {
            handler(newValue) {
                const store = useAudiodbStore();
                store.updateSearchCondition(newValue);
            },
            deep: true
        },
        tableItems: {
            handler(newValue) {
                const store = useAudiodbStore();
                store.updateEditViewTableItem(newValue);
            },
            deep: true
        },
        paginations:{
            handler(newValue) {
                const store = useAudiodbStore();
                store.updatePagination(newValue);
            },
            deep: true
        },
        'searchCondition.toEditDate': {
            handler(val) {
                if(val && val[1] !== null){
                    this.toEditInputOptions.rangeSeparator = '-'
                }else{
                    this.toEditInputOptions.rangeSeparator = ''
                }
            },
            deep: true
        },
        checkItem:{
            handler(newValue) {
                const store = useAudiodbStore();
                store.updateChecklistItem(newValue);
            },
        }
    },
    mounted(){
        this.getPagePermission()
        localStorage.removeItem('wordTextInfo')
        localStorage.removeItem('editData')
        const origin = localStorage.getItem('origin')
        if(origin){
            this.$router.push('/admin/uploadAudio')
        }else{
            // 路由有帶參數 reset --> 才重置 pinia
            const store = useAudiodbStore();
            const route = useRoute()
            if (Object.keys(route.query).length && route.query.action === 'reset' ) {
                store.$reset();
                this.$router.replace(route.path);
                return
            }
        }
        
    },
    methods:{
        uploadAudio(){
            localStorage.setItem('origin', 'audio')
            this.$router.push('/admin/uploadAudio')
        },
        checkCheckbox() {
            if (this.checkAllItem === true) {
                this.checkItem = [];
                this.checkAllItem = false
            } else {
                this.tableItems.forEach((t, index) => {
                    t.defs.forEach(i => {
                        i.audios.forEach(j => {
                            this.checkItem.push(j.voiceId)
                        })
                    })
                    this.checkAllItem = true
                })
            }
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            const isUtc = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-');
            if (isUtc) {
                date.setHours(date.getHours() + 8);
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}`;
            return formattedDateTime;
        },
        previewAudio(data, item, sequence){
            
            this.previewAudioDialog = true
            this.previewData = {
                wordText: data.wordText,
                sequence: sequence,
                data: item
            }
        },
        searchAudio(pageInit){
            this.loading = true
            const wordText = this.searchCondition.wordText || ''
            // 頁數跟數量
            let page = this.paginations.currentPage
            if(pageInit){
                page = pageInit
            }
            const pageSize = this.selectedListAmount
            // 排序
            const sortBy = this.searchCondition.sortBy || ''
            const sortOrder = this.searchCondition.sortDirection || ''
            batchAudioSrv.searchAudio(wordText, page, pageSize).then((res) => {
                this.loading = false
                if(res.data.rtnCode === '0000'){
                    this.tableItems = res.data.data.searchResult
                    this.paginations = res.data.pagination
                    for (let item of this.tableItems) {
                        if (!this.checkItem.some(checkItem => checkItem === item.wordId)) {
                            this.checkAllItem = false;
                        }else{
                            this.checkAllItem = true
                        }
                    }
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
                }
            })
        },
        clearSearch(){
            this.searchCondition.wordText = '';
            this.searchCondition.page = 1;
            this.pageSize = 10;
        },
        formatTime(value){
            return value.split("T")[0];
        },
        setPage(page){
            const store = useAudiodbStore();
            this.paginations.currentPage = page
            store.updateCurrentPage(page)
        },
        transformDate(date){
            if(date){
                const year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                // 將月份和日期補0
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;

                return `${year}-${month}-${day}`;
            }
            return ''
        },
        sortDBList(header){
            // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
            if(header.value === ''){
                return
            }
            if (header.value !== this.searchCondition.sortBy) {
                this.headers.forEach((item) => item.sort = '');
            };
            // 找出哪個欄位要排序，給予對應的條件值
            const idx = this.headers.findIndex((item) => item === header);
            if (idx !== -1) {
                this.headers[idx].sort = header.sort ? (header.sort === 'ASC' ?  'DESC' : 'ASC') : 'DESC';
                this.searchCondition.sortBy = header.value;
                this.searchCondition.sortDirection = this.headers[idx].sort;
                this.paginations.currentPage = 1
            };
            this.searchAudio(1);
        },
        getPagePermission(){
            const id = 10
            const user = JSON.parse(localStorage.getItem('cieebo-admin-user'))
            const obj = {
                userAccount: user.backendUserAccount
            }
            userPagePermissionSrv.getUserPagePermission(id, obj).then((res) => {
                res.data.data.permissions.forEach(i => {
                    this.pagePermissions.push(i.permissionId)
                })
            })
        },
        exportAudio(){
            const voiceIds = {
                voiceIds: []
            }
            this.checkItem.forEach(i => {
                voiceIds.voiceIds.push(i)
            })
            this.loading = true
            batchAudioSrv.batchAudioExport(voiceIds).then((res) => {
                this.loading = false
                if (res.isSuccess) {
                    const blob = new Blob([res.data.data], { type: res.data.headers['content-type'] });
                    const url = window.URL.createObjectURL(blob);

                    // 使用 JSZip 讀取 zip 檔案
                    JSZip.loadAsync(blob).then(zip => {
                        const zipPromises = [];

                        zip.forEach((relativePath, file) => {
                            zipPromises.push(
                                file.async('blob').then(content => {
                                    const decodedName = decodeURIComponent(relativePath);
                                    return { name: decodedName, content: content };
                                })
                            );
                        });

                        Promise.all(zipPromises).then(files => {
                            const newZip = new JSZip();

                            files.forEach(file => {
                                newZip.file(file.name, file.content);
                            });

                            newZip.generateAsync({ type: 'blob' }).then(newBlob => {
                                const newUrl = window.URL.createObjectURL(newBlob);
                                const link = document.createElement('a');
                                link.style.display = 'none';
                                link.href = newUrl;
                                link.setAttribute('download', `音檔匯出.zip`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                // 釋放 URL 對象
                                window.URL.revokeObjectURL(newUrl);
                                window.URL.revokeObjectURL(url);
                            });
                        });
                    }).catch(err => {
                        console.error("Error reading zip file:", err);
                    });
                } else {
                    this.$swal.fire({
                        toast: true,
                        position: 'center',
                        title: res.msg,
                        width: 500,
                        background: '#19191A',
                        confirmButtonColor: '#6359E9',
                        padding: 25,
                        customClass: {
                            title: 'swal-content',
                            confirmButton: 'confirm-btn-class'
                        }
                    })
                }
            }).catch(err => {
                this.loading = false;
                console.error("Error in batch audio export:", err);
            });
        }
    },
}

</script>
<style lang="scss">
    .v-btn--disabled.v-btn--variant-elevated .v-btn__overlay{
        opacity: 0;
    }
    a{
        text-decoration: none;
        color: inherit;
    }
    .v-table{
        table{
            tbody{
                tr{
                    td{
                        &.grey{
                            color: #9E9E9E;
                        }
                        &.green{
                            color: #4CAF50;
                        }
                        &.blue{
                            color: #2196F3;
                        }
                        &.red{
                            color: #F61E1E;
                        }
                    }
                }
            }
        }
    }
    .side-borders{
        border-left: 1px solid #E0E0E0;
        border-right: 1px solid #E0E0E0;
    }
</style>
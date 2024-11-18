<template>
    <div class="">
        <v-form v-model="validation">
            <v-row class="py-4">
                <v-col cols="3">
                    <v-text-field v-model="searchCondition.wordName" variant="outlined" label="搜尋值"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-select
                    label="搜尋欄位"
                    :items="seachCol"
                    item-title="label"
                    item-value="value"
                    v-model="searchCondition.searchCol"
                    variant="outlined"
                    multiple
                    ></v-select>
                </v-col>
                <v-col cols="3">
                    <v-select
                        v-model="searchCondition.editStatus"
                        item-text="title"
                        item-value="val"
                        :items="statusList"
                        variant="outlined"
                        label="字詞狀態"
                        hide-details
                        no-data-text="請選擇字詞狀態"
                    ></v-select>
                </v-col>
                <v-col cols="3">
                    <v-select
                    label="顯示筆數"
                    :items="listAmount"
                    v-model="selectedListAmount"
                    variant="outlined"
                    ></v-select>
                </v-col>
                
                <v-col cols="3" class="d-flex offset-9">
                    <v-col class="py-0 pl-0">
                        <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
                    </v-col>
                    <v-col class="py-0 pr-0">
                        <v-btn :disabled="searchCondition.wordName === '' || searchCondition.searchCol.length === 0" class="w-100" variant="flat" color="success" @click="searchWord(1)">搜尋</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-7 d-flex align-end justify-space-between">
            <v-row class="align-center" no-gutters>
                <p class="mb-0 mr-2"  v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p>
                <v-col>
                    <PaginationComponent :pageLength="paginations.totalPages" :current-page="paginations.currentPage" @get-list="searchWord" @set-page="setPage"></PaginationComponent>
                </v-col>
            </v-row>
            
            <div class="ms-auto">
                <v-btn :disabled="checkItem.length === 0" class="mr-2" flat color="#1976D2" @click="batchEdit()">批次修改</v-btn>
            </div>
        </div>

        <div class="tableArea" id="tableArea">
            <table class="mt-4">
                <thead>
                    <tr>
                        <th class="text-left" width="50px">
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
                    <tr v-for="(item, index) in tableItems" :key="item">
                        <td style="width: 50px">
                            <v-checkbox v-model="checkItem" :value="item" hide-details :disabled="item.status !== 0"></v-checkbox>
                        </td>
                        <td>{{ item.wordName }}</td>
                        <td :class="editStatusStyle(item.status)">{{ editStatusText(item.status) }}</td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.definitionText }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.zhuyin }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.pinyin }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.definitionTranslated }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.exampleSentence }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.collocation }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.synonym }}</p></td>
                        <td><p class="mb-2" v-for="defItems in item.defs">{{ defItems.antonym }}</p></td>
                        <td class="text-center" style="width: 50px">
                            <a href="#" @click.prevent="previewWord(item)">
                                <v-tooltip text="預覽" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-file-eye-outline me-2" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <LoadingComponent :loading="loading"/>
    <!-- 預覽 -->
    <v-dialog v-model="batchEditDialog" max-width="800px" max-height="600px" persistent>
        <EditComponent :checkItem="checkItem" @close-dialog="batchEditDialog = false" @get-list="searchWord(1)"></EditComponent>
    </v-dialog>
</template>

<script>
import { storeToRefs } from 'pinia';
// import { useBatchEditdbStore } from '@/stores/BatchEditdatabase.js';
import PaginationComponent from '@/components/PaginationComponent.vue';
import EditComponent from '@/components/batchEdit/EditComponent.vue';
import batchSrv from '@/service/batchEdit.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useRoute } from 'vue-router';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import helperUtil from '@/utils/helpers/helper.js';
import alldatabaseSrv from '@/service/alldatabase';
import validateHelper from '@/utils/helpers/validate.js';

export default {
    components: { 
        PaginationComponent,
        LoadingComponent,
        EditComponent,
    },
    data() {
        return {
            searchCondition:{
                wordName: null, // 字詞名
                searchCol: [], // 搜尋欄位
                sortBy: '',
                sortDirection: 'DESC',
                editStatus: null,
                page: 1,
                pageSize: 50,
            },
            listAmount: [10,50,200,500],
            selectedListAmount: 50,
            checkItem: [],
            checkAllItem: false,
            tableItems: [],
            wordIds: [],
            sortBy: '',
            sortOrder: '',
            paginations: {
                currentPage: 1,
                totalCount: 0,
                totalPages: 1,
            },
            loading: false,
            headers:[
                {
                    title: '字詞名',
                    value: '',
                    sort: '',
                    width: '100px'
                },
                {
                    title: '狀態',
                    value: '',
                    sort: '',
                    width: '80px'
                },
                {
                    title: '釋義',
                    value: '',
                    sort: '',
                    width: '150px'
                },
                {
                    title: '注音',
                    value: '',
                    sort: '',
                    width: '150px'
                },
                {
                    title: '漢語拼音',
                    value: '',
                    sort: '',
                    width: '150px'
                },
                {
                    title: '英文釋義',
                    value: '',
                    sort: '',
                    width: '300px'
                },
                {
                    title: '例句',
                    value: '',
                    sort: '',
                    width: '300px'
                },
                {
                    title: '用法',
                    value: '',
                    sort: '',
                    width: '300px'
                },
                {
                    title: '近義詞',
                    value: '',
                    sort: '',
                    width: '150px'
                },
                {
                    title: '反義詞',
                    value: '',
                    sort: '',
                    width: '150px'
                },
            ],
            seachCol: [
                {
                    label: '字詞名',
                    value: 'wordName'
                },
                {
                    label: '釋義',
                    value: 'definition'
                },
                {
                    label: '漢語拼音',
                    value: 'pinyin'
                },
                {
                    label: '注音',
                    value: 'zhuyin'
                },
                {
                    label: '英文釋義',
                    value: 'definitionTranslated'
                },
                {
                    label: '例句',
                    value: 'exampleSentence'
                },
                {
                    label: '用法',
                    value: 'collocation'
                },
                {
                    label: '近義詞',
                    value: 'synonym'
                },
                {
                    label: '反義詞',
                    value: 'antonym'
                },
            ],
            pagePermissions:[],
            allWordIds:[],
            batchEditDialog: false,
            searchDisable: true,
            validation: false,
            selectedCol:[],
            rules:[
                {
                    nullRule: (value) => {
                        return value !== null || '此欄位不得為空';
                    }   
                }
                
            ],
            statusList:[],
        };
    },
    created() {
        const store = useBatchEditdbStore();
        const { searchCondition, editViewTableItem, paginations, checkItem } = storeToRefs(store);
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
    },
    watch: {
        searchCondition: {
            handler(newValue) {
                const store = useBatchEditdbStore();
                store.updateSearchCondition(newValue);
            },
            deep: true
        },
        tableItems: {
            handler(newValue) {
                const store = useBatchEditdbStore();
                store.updateEditViewTableItem(newValue);
                
                if(newValue){
                    document.getElementById('tableArea').style.height = '65vh';
                } else {
                    document.getElementById('tableArea').style.height = 'auto'; // 或設定回預設高度
                }
            },
            deep: true
        },
        paginations:{
            handler(newValue) {
                const store = useBatchEditdbStore();
                store.updatePagination(newValue);
            },
            deep: true
        },
        checkItem:{
            handler(newValue) {
                const store = useBatchEditdbStore();
                store.updateChecklistItem(newValue);
            },
        },
    },
    mounted(){
        this.getPagePermission()
        this.getSearchList()
        localStorage.removeItem('wordTextInfo')
        localStorage.removeItem('editData')

        // 路由有帶參數 reset --> 才重置 pinia
        const store = useBatchEditdbStore();
        const route = useRoute()
        if (Object.keys(route.query).length && route.query.action === 'reset') {
            store.$reset();
            this.$router.replace(route.path);
            // this.searchWord(1);
            return
        }
    },
    methods:{
        getSearchList(){
            alldatabaseSrv.getSearchList().then((res) => {
                if (!res.isSuccess) {
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                    return
                };
                const statusAll = [{ wordNumber: '', wordNameZh: '所有字詞狀態', wordName: 'all' }, ...res.data.statuses];
                this.statusList = statusAll.map((status) => {return { title: status.wordNameZh, val: status.wordNumber }});
            })
        },
        editStatusStyle(status){
            return helperUtil.alldbEditStatusStyle(status);
        },
        editStatusText(status){
            return helperUtil.alldbStatusText(status);
        },
        checkCheckbox() {
            if (this.checkAllItem === true) {
                this.checkItem = [];
                this.checkAllItem = false
            } else {
                this.checkItem = this.allWordIds.filter(item => item.status === 0)
                console.log(this.checkItem)
                if(this.checkItem.length === 0){
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: '所有字詞狀態皆無法進行批次修改',
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                    this.checkAllItem = false
                }else{
                    this.checkAllItem = true
                }
            }
        },
        trueCount(){
            return this.checkItem.filter(item => item === true).length;
        },
        searchWord(pageInit){
            this.loading = true
            this.checkAllItem = false
            this.checkItem = []
            this.tableItems = []
            const wordName = this.searchCondition.wordName || ''
            let editStatus = typeof this.searchCondition.editStatus === 'number' ? this.searchCondition.editStatus : ''

            // 頁數跟數量
            let page = this.paginations.currentPage
            if(pageInit){
                page = pageInit
            }
            const pageSize = this.selectedListAmount

            // 排序
            const sortBy = this.searchCondition.sortBy || ''
            const sortOrder = this.searchCondition.sortDirection || ''
            this.allWordIds = []
            this.selectedCol = this.searchCondition.searchCol
            console.log(editStatus)
            
            let param = `page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&editStatus=${editStatus}`

            this.searchCondition.searchCol.forEach((item) => {
                param += `&${item}=${wordName}`
            })

            batchSrv.searchBatchEdit(param).then((res) => {
                this.loading = false

                if(res.data.rtnCode === '0000'){
                    this.tableItems = res.data.data
                    this.paginations = res.data.pagination
                    this.allWordIds = this.tableItems
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
                    this.paginations = {
                        currentPage: 1,
                        totalCount: 0,
                        totalPages: 1,
                    }
                }
            })
        },
        clearSearch(){
            this.searchCondition.toEditDate = [],
            this.searchCondition.wordName = '',
            this.searchCondition.searchCol = [],
            this.searchCondition.page = 1,
            this.searchCondition.editStatus = null,
            this.pageSize = 10,
            this.sortBy = '',
            this.sortOrder = ''
        },
        batchEdit(){
            this.batchEditDialog = true
        },
        // 預覽
        previewWord(obj){
            const id = obj.wordId
            console.log(obj)
            alldatabaseSrv.getWordDetail(id).then((res) => {
                const wordData = JSON.stringify(res.data) 
                localStorage.setItem('wordTextInfo', wordData)
                this.$router.push(`/admin/WordDetail/${id}`)
            })
        },
        setPage(page){
            const store = useBatchEditdbStore();
            this.paginations.currentPage = page
            store.updateCurrentPage(page)
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
            this.searchWord();
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
        returnTable(item){
            this.loading = true
            this.tableItems = item
            this.loading = false
        },
    },
}

</script>
<style lang="scss">
    a{
        text-decoration: none;
        color: inherit;
    }
    .tableArea{
        overflow-x: scroll;
        // position: relative;
        table{
            position: relative;
            width: 2500px;
            border: 1px solid #E0E0E0;
            thead{
                position: sticky;
                top: -10px;
                background-color: white;
                z-index: 1;
                
                tr{
                    border: 1px solid #E0E0E0;
                    th{
                        color: #0E2A34;
                        font-weight: 500;
                        font-size: 14px;
                        padding: 10px 16px;
                        text-align: center;
                    }
                }
            }
            tbody{
                overflow-y: scroll;
                tr{
                    border-bottom: 1px solid #E0E0E0;
                    td{
                        padding: 5.5px 16px;
                        font-size: 14px;
                        
                        &.word-general {
                            color: #4CAF50;
                        }
                        &.word-edit {
                            color: #FF9800;
                        }
                        &.word-aduit {
                            color: #2196F3;
                        }
                    }
                    // &:first-child{
                    //     td{
                    //         // padding-top: 50px;
                    //     }
                    // }
                }
            }
        }
    }
    .vertical-top{
        vertical-align: baseline !important;
    }
    .noCursor{
        cursor: default;
    }
</style>
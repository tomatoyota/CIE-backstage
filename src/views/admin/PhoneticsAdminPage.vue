<template>
    <div class="">
        <v-form>
            <v-row class="py-4">
                <v-col cols="3" class="py-2">
                    <v-text-field v-model="searchCondition.pinyin" variant="outlined" label="漢語拼音" hide-details></v-text-field>
                </v-col>
                <v-col cols="3" class="py-2">
                    <v-text-field v-model="searchCondition.zhuyin" variant="outlined" label="注音" hide-details></v-text-field>
                </v-col>
                <v-col cols="3" class="d-flex offset-3">
                    <v-col class="py-0 pl-0">
                        <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
                    </v-col>
                    <v-col class="py-0 pr-0">
                        <v-btn class="w-100" flat color="success" @click="searchPhonetics(1)">搜尋</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-7 d-flex align-end justify-space-between">
            <v-row class="align-center" no-gutters>
                <p class="mb-0" v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p>
                <v-col>
                    <PaginationComponent :pageLength="paginations.totalPages" :current-page="paginations.page" @get-list="searchPhonetics" @set-page="setPage"></PaginationComponent>
                </v-col>
            </v-row>
            <div class="ms-auto">
                <v-btn class="mr-2" flat color="#1976D2"><RouterLink to="/admin/phoneticsView">新增字音對應</RouterLink></v-btn>
                <v-btn class="mr-2" flat color="#1976D2" @click="triggerImportDialog">匯入</v-btn>
                <v-btn class="mr-2" flat @click="triggerExportDialog" :disabled="tableItems.length === 0 " :color="tableItems.length === 0 ? '#F5F5F5' : '#1976D2' ">匯出</v-btn>
                <v-btn class="mr-2" flat color="#1976D2" @click="downloadTemplate()">模板下載</v-btn>
            </div>
        </div>
        <v-table class="mt-4">
            <thead>
                <tr>
                    <!-- <th><v-checkbox v-model="selectAll" hide-details width="5%" @click.prevent="selectAllCheckbox()"></v-checkbox></th> -->
                    <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
                        <a href="#" class="text-decoration-none text-darkprimary d-flex align-center" @click.prevent="sortDBList(header)" :class="header.value !== '' ? '' : 'noCursor'">
                            {{ header.title }}
                            <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'ASC'"></v-icon>
                            <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'DESC'"></v-icon>
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableItems">
                    <!-- <td><v-checkbox v-model="selectedItem" hide-details :value="item"></v-checkbox></td> -->
                    <td>{{ item.pinyin }}</td>
                    <td>{{ item.zhuyin }}</td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ formatDate(item.updatedAt) }}</td>
                    <td class="text-center" style="width: 400px">
                        <a href="#" @click.prevent="editPhonetics(item)">
                            <v-tooltip text="編輯字音對應表" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="mdi mdi-pencil" x-large></v-icon>
                                </template>
                            </v-tooltip>
                        </a>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
    <LoadingComponent :loading="loading"/>
    <v-dialog v-model="importDialog" max-width="500px" persistent>
        <importComponent @close-dialog="closeImportDialog"></importComponent>
    </v-dialog>
    <v-dialog v-model="exportDialog" max-width="500px" persistent>
        <exportComponent @close-dialog="closeExportDialog" :selectedPinyin="searchCondition.pinyin"></exportComponent>
    </v-dialog>
</template>

<script>
import { storeToRefs } from 'pinia';
// import { phoneticStore } from '@/stores/phonetics.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import phoneticSrv from '@/service/phonetics.js';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import { useRoute } from 'vue-router';
import importComponent from '@/components/phonetics/importComponent.vue';
import exportComponent from '@/components/phonetics/exportComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import PhoneticsTemplate from '@/files/Phonetics_Template.xlsx';

export default {
    components: { 
        VueDatePicker,
        PaginationComponent,
        importComponent,
        exportComponent,
        LoadingComponent
    },
    data() {
        return {
            searchCondition:{
                pinyin: '', 
                zhuyin:'',
                sortBy: 'updatedAt',
                sortDirection: 'DESC',
                page: 1,
                pageSize: 10,
            },
            tableItems: [],
            paginations: {
                page: 1,
                totalCount: 0,
                totalPages: 1,
            },
            loading: false,
            headers:[
                {
                    title: '漢語拼音',
                    value: 'pinyin',
                    sort: '',
                    width: '20%'
                },
                {
                    title: '注音',
                    value: 'zhuyin',
                    sort: '',
                    width: '20%'
                },
                {
                    title: '建立日期',
                    value: 'createdAt',
                    sort: '',
                    width: '20%'
                },
                {
                    title: '異動日期',
                    value: 'updatedAt',
                    sort: '',
                    width: '20%'
                },
                {
                    title: '',
                    value: '',
                    sort: '',
                    width: '10%'
                },
            ],
            selectAll:[],
            selectedItem:[],
            updateDateInputOptions: {
                rangeSeparator: ''
            },
            createDateInputOptions: {
                rangeSeparator: ''
            },
            pageId: 22,
            pagePermissions:[],
            deleteIPDialog: false,
            exportDialog: false,
            importDialog: false,
        };
    },
    created() {
        const store = phoneticStore();
        const { searchCondition, editViewTableItem, paginations } = storeToRefs(store);
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
                const store = phoneticStore();
                store.updateSearchCondition(newValue);
            },
            deep: true
        },
        tableItems: {
            handler(newValue) {
                const store = phoneticStore();
                store.updateEditViewTableItem(newValue);
            },
            deep: true
        },
        paginations:{
            handler(newValue) {
                const store = phoneticStore();
                store.updatePagination(newValue);
            },
            deep: true
        },
    },
    mounted(){
        this.getPagePermission()
        localStorage.removeItem('isEdit')
        localStorage.removeItem('phoneticsData')
        // 路由有帶參數 reset --> 才重置 pinia
        const store = phoneticStore();
        const route = useRoute()
        if (Object.keys(route.query).length && route.query.action === 'reset') {
            this.$router.replace(route.path);
            store.$reset();
            return
        }
    },
    methods:{
        getPagePermission(){
            const id = 22
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
        searchPhonetics(pageNumber){
            this.loading = true
            const pinyin = this.searchCondition.pinyin || ''
            const zhuyin = this.searchCondition.zhuyin || ''
           
            // 頁數跟數量
            let page = null
            if(pageNumber){
                page = pageNumber
            }else{
                page = this.paginations.page
            }
            const pageSize = this.searchCondition.pageSize
            const sortBy = this.searchCondition.sortBy
            const sortDirection = this.searchCondition.sortDirection
            // 排序
            phoneticSrv.searchPhonetics(zhuyin, pinyin, page, pageSize, sortBy, sortDirection).then((res) => {
                this.loading =  false
                
                this.tableItems = res.data.data
                if(res.data.pagination){
                    this.paginations = res.data.pagination
                }

                if(res.data.rtnCode === '0001'){
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
            this.searchCondition.pinyin = '';
            this.searchCondition.zhuyin = '';
            this.searchCondition.page = 1;
            this.pageSize = 10;
            this.sortBy = '';
            this.sortOrder = '';
        },
        formatTime(value){
            return value.split("T")[0];
        },
        setPage(page){
            const store = phoneticStore();
            store.updateCurrentPage(page)
            store.value = page;
            this.paginations.page = page
        },
        editPhonetics(item){
            const phoneticsData = JSON.stringify(item)
            localStorage.setItem('phoneticsData', phoneticsData)
            localStorage.setItem('isEdit', true)
            this.$router.push('/admin/phoneticsView')
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
                this.paginations.page = 1
            };
            this.searchPhonetics();
        },
        formatSeachDate(date){
            if(date){
                const year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;

                return `${year}-${month}-${day}`;
            }
        },
        selectAllCheckbox(){
            if(this.selectAll.length === 0){
                this.tableItems.forEach(i => {
                    this.selectedItem.push(i)
                })
                this.selectAll = true
            }
        },
        // 匯出 dialog
        triggerExportDialog(item){
            this.exportDialog = true
        },
        closeExportDialog(){
            this.exportDialog = false
        },
        // 匯入 dialog
        triggerImportDialog(){
            this.importDialog = true
        },
        closeImportDialog(){
            this.importDialog = false
        },
        async downloadTemplate() {
            try {
                const response = await fetch(PhoneticsTemplate);
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', 'Phonetics_Template.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href); // 釋放內存
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        },
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
    
</style>
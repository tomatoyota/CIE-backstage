<template>
    <div class="">
        <v-form>
            <v-row class="py-4">
                <v-col cols="3" class="py-2">
                    <v-text-field v-model="searchCondition.ipname" variant="outlined" label="IP 區段名稱" hide-details></v-text-field>
                </v-col>
                <v-col cols="3" class="py-2">
                    <v-text-field v-model="searchCondition.ip" variant="outlined" label="IP 設定內容" hide-details></v-text-field>
                </v-col>
                
                <v-col cols="3" class="py-2">
                    <VueDatePicker
                    label="建立時間"
                    v-model="searchCondition.createDate"
                    range
                    :teleport="true"
                    format="yyyy/MM/dd"
                    placeholder="建立時間"
                    :text-input="createDateInputOptions"
                    :enable-time-picker="false"
                    >
                    </VueDatePicker>
                </v-col>

                <v-col cols="3" class="py-2">
                    <VueDatePicker
                    label="修改時間"
                    v-model="searchCondition.updateDate"
                    range
                    :teleport="true"
                    format="yyyy/MM/dd"
                    placeholder="修改時間"
                    :text-input="updateDateInputOptions"
                    :enable-time-picker="false"
                    >
                    </VueDatePicker>
                </v-col> 
                
                <v-col cols="3" class="d-flex offset-9">
                    <v-col class="py-0 pl-0">
                        <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
                    </v-col>
                    <v-col class="py-0 pr-0">
                        <v-btn class="w-100" flat color="success" @click="searchIP(1)">搜尋</v-btn>
                    </v-col>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-7 d-flex align-end justify-space-between">
            <v-row class="align-center" no-gutters>
                <p class="mb-0" v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p>
                <v-col>
                    <PaginationComponent :pageLength="paginations.totalPages" :current-page="paginations.page" @get-list="searchIP" @set-page="setPage"></PaginationComponent>
                </v-col>
            </v-row>
            
            <div class="ms-auto">
                <v-btn class="mr-2" flat color="#1976D2"><RouterLink to="/admin/IPView">新增IP</RouterLink></v-btn>
            </div>
        </div>

        <v-table class="mt-4">
            <thead>
                <tr>
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
                    <td>{{ item.name }}</td>
                    <td v-if="item.singleIp !== null">{{ item.singleIp }}</td>
                    <td v-else>
                        <span>{{ item.ipStart }}</span>~
                        <span>{{ item.ipEnd }}</span>
                    </td>
                    <td>{{ formatDate(item.createdAt) }}</td>
                    <td>{{ formatDate(item.updatedAt) }}</td>
                    <td class="text-center" style="width: 400px">
                        <a href="#" @click.prevent="editIP(item.whitelistId)">
                            <v-tooltip text="編輯IP區段" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="mdi mdi-pencil" x-large></v-icon>
                                </template>
                            </v-tooltip>
                        </a>
                        <a href="#" @click.prevent="deleteDialog(item.whitelistId)">
                            <v-tooltip text="刪除" location="bottom">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="mdi mdi-trash-can-outline me-2" x-large></v-icon>
                                </template>
                            </v-tooltip>
                        </a>
                    </td>
                </tr>
            </tbody>
        </v-table>
        
    </div>
    <LoadingComponent :loading="loading"/>
    <v-dialog v-model="deleteIPDialog" max-width="500px" persistent>
        <boAdminComponent :IPInfo="IPInfo" @close-dialog="closeDialog"></boAdminComponent>
    </v-dialog>
</template>

<script>
import { storeToRefs } from 'pinia';
// import { IPStore } from '@/stores/IP.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import IPSrv from '@/service/IP.js';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import boAdminComponent from '@/components/ip/boAdminComponent.vue';
import { useRoute } from 'vue-router';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    components: { 
        VueDatePicker,
        PaginationComponent,
        boAdminComponent,
        LoadingComponent,
    },
    data() {
        return {
            searchCondition:{
                ipname: '', 
                ip:'',
                whitelistId:'',
                createDate: [],
                updateDate: [],
                sortBy: 'updatedAt',
                sortDirection: 'DESC',
                page: 1,
                pageSize: 10,
            },
            tableItems: [],
            sortBy: '',
            sortOrder: '',
            paginations: {
                page: 1,
                totalCount: 0,
                totalPages: 1,
            },
            IPInfo: null,
            loading: false,
            headers:[
                {
                    title: 'IP 區段名稱',
                    value: 'name',
                    sort: '',
                    width: '20%'
                },
                {
                    title: 'IP 設定內容',
                    value: '',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '建立時間',
                    value: 'createdAt',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '修改時間',
                    value: 'updatedAt',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '',
                    value: '',
                    sort: '',
                    width: '10%'
                },
            ],
            updateDateInputOptions: {
                rangeSeparator: ''
            },
            createDateInputOptions: {
                rangeSeparator: ''
            },
            pageId: 16,
            pagePermissions:[],
            deleteIPDialog: false,
        };
    },
    created() {
        const store = IPStore();
        const { searchCondition, editViewTableItem, tableItems, paginations } = storeToRefs(store);
        // 搜尋欄位狀態儲存
        if(searchCondition){
            this.searchCondition = searchCondition
        }
        // table 狀態儲存
        if(tableItems){
            this.tableItems = tableItems
        }
        if(paginations){
            this.paginations = paginations
        }
    },
    watch: {
        searchCondition: {
            handler(newValue) {
                const store = IPStore();
                store.updateSearchCondition(newValue);
            },
            deep: true
        },
        tableItems: {
            handler(newValue) {
                const store = IPStore();
                store.updateEditViewTableItem(newValue);
            },
            deep: true
        },
        paginations:{
            handler(newValue) {
                const store = IPStore();
                store.updatePagination(newValue);
            },
            deep: true
        },
        'searchCondition.updateDate': {
            handler(val) {
                if(val && val[1] !== null){
                    this.updateDateInputOptions.rangeSeparator = '-'
                }else{
                    this.updateDateInputOptions.rangeSeparator = ''
                }
            },
            deep: true
        },
        'searchCondition.createDate': {
            handler(val) {
                if(val && val[1] !== null){
                    this.createDateInputOptions.rangeSeparator = '-'
                }else{
                    this.createDateInputOptions.rangeSeparator = ''
                }
            },
            deep: true
        }
    },
    mounted(){
        this.getPagePermission()
        localStorage.removeItem('isEdit')
        localStorage.removeItem('ipData')
        // 路由有帶參數 reset --> 才重置 pinia
        const store = IPStore();
        const route = useRoute()
        if (Object.keys(route.query).length && route.query.action === 'reset') {
            this.$router.replace(route.path);
            store.$reset();
            return
        }
    },
    methods:{
        getPagePermission(){
            const id = 16
            const user = JSON.parse(localStorage.getItem('cieebo-admin-user'))
            const obj = {
                userAccount: user.backendUserAccount
            }
            userPagePermissionSrv.getUserPagePermission(id, obj).then((res) => {
                if(res.isSuccess){
                    res.data.data.permissions.forEach(i => {
                        this.pagePermissions.push(i.permissionId)
                    })
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
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
        searchIP(pageNumber){
            this.loading = true
            let createdAtStart = ''
            let createdAtEnd = ''
            if(this.searchCondition.createDate && this.searchCondition.createDate.length > 0){
                createdAtStart = encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[0]) + 'T00:00:00') || '';
                createdAtEnd = this.searchCondition.createDate[1] 
                    ? encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[1]) + 'T23:59:59')
                    : encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[0]) + 'T23:59:59');
            }

            let updatedAtStart = ''
            let updatedAtEnd = ''
            if (this.searchCondition.updateDate && this.searchCondition.updateDate.length > 0) {
                updatedAtStart = this.searchCondition.updateDate[0] 
                    ? encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[0]) + 'T00:00:00') 
                    : '';
                updatedAtEnd = this.searchCondition.updateDate[1] 
                    ? encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[1]) + 'T23:59:59') 
                    : encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[0]) + 'T23:59:59');
            }
            const ip = this.searchCondition.ip || ''
            const name = this.searchCondition.ipname || ''
            const userAccount = ''
            const whitelistId = ''
            // 頁數跟數量
            let page = null
            if(pageNumber){
                page = pageNumber
            }else{
                page = this.paginations.page
            }
            const pageSize = this.searchCondition.pageSize

            // 排序
            const sortBy = this.searchCondition.sortBy || ''
            const sortDirection = this.searchCondition.sortDirection || ''
            IPSrv.searchIP(ip, name, userAccount, whitelistId, createdAtStart, createdAtEnd, updatedAtStart, updatedAtEnd, page, pageSize, sortBy, sortDirection).then((res) => {
                this.loading =  false

                this.tableItems = res.data.data
                const store = IPStore();
                store.updateEditViewTableItem(this.tableItems);
                if(res.data.pagination){
                    this.paginations = res.data.pagination
                }
                if(!res.isSuccess){
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
            this.searchCondition = {
                ipname: '', 
                ip:'',
                whitelistId:'',
                createDate: [],
                updateDate: [],
                sortBy: 'updatedAt',
                sortDirection: 'DESC',
                page: 1,
                pageSize: 10,
            }
        },
        formatTime(value){
            if(value){
                return value.split("T")[0];
            }
        },
        setPage(page){
            const store = IPStore();
            store.updateCurrentPage(page)
            store.value = page;
            this.paginations.page = page
        },
        editIP(id){
            IPSrv.getIP(id).then((res) => {
                if(res.isSuccess){
                    const ipData = JSON.stringify(res.data[0])
                    localStorage.setItem('ipData', ipData)
                    localStorage.setItem('isEdit', true)
                    this.$router.push('/admin/ipView')
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
            })
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
            this.searchIP();
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
        deleteDialog(item){
            this.IPInfo = item
            this.deleteIPDialog = true
        },
        closeDialog(){
            this.deleteIPDialog = false
            this.searchIP(1)
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
    
</style>
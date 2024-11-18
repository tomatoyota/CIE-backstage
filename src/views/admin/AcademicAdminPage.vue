<template>
  <!-- <div class="mb-2"> -->
    <v-text-field
    v-model="keyword"
    append-inner-icon="mdi-magnify"
    @click:append-inner="keywordSearch"
    hide-details
    placeholder="輸入出版品關鍵字搜尋"
    density="compact"
    variant="solo"
    flat
    elevation="0"
    bg-color="#dddeea"
    class="my-4 w-25"
    clearable
    ></v-text-field>

    <v-row class="justify-space-between">
      <v-col cols="2" class="d-flex align-center">
        <div class="bold mr-2">顯示範圍</div>
        <v-select
          v-model="selectedYear"
          :items="['全部', '2024', '2023', '2022', '2021', '2020']"
          placeholder="全部"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="2" class="text-right">
        <v-btn color="primary" flat @click="addAcademicItem()">
          建立新發行
        </v-btn>
      </v-col>
    </v-row>
    
    <v-table
      class="mt-4 mb-2"
      :height="paginatedItems.length > 10 ? '550px' : ''"
      :fixed-header="paginatedItems.length > 10"
    >
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.value" class="no-wrap" :width="header.width">
            <a 
            href="#" 
            class="text-decoration-none text-darkprimary d-flex align-center"
            :class="!header.value ? 'no-cursor': ''"
            @click.prevent="sortDBList(header)">
                {{ header.text }}
                <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'ASC'"></v-icon>
                <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'DESC'"></v-icon>
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" :key="item.id" class="hover-effect">
          <td class="no-wrap">{{ item.volume }}</td>
          <td class="no-wrap">{{ item.issue }}</td>
          <td class="no-wrap">{{ formatDate(item.releaseAt) }}</td>
          <td class="no-wrap">{{ item.title }}</td>
          <td class="no-wrap">{{ formatDate(item.updatedAt) }}</td>
          
          <td class="no-wrap text-right">
            <v-btn variant="outlined" class="text-style" @click="getAcademicsDetail(item.academicId)">編輯</v-btn>
            <v-btn variant="text" class="text-style" @click="deleteAcademicsItemCheck(item.academicId)">刪除</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  <!-- </div> -->
  <LoadingComponent :loading="loading" />
  <PaginationComponent :currentPage="paginations.currentPage" :pageLength="paginations.totalPages" circle class="custom-pagination" @setPage="setNewPage"></PaginationComponent>
</template>
  
<script>
  import academicsSrv from '@/service/academics.js'
  import Swal from '@/utils/sweetAlert';
  import LoadingComponent from '@/components/LoadingComponent.vue';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import { storeToRefs } from 'pinia';
  import { useAcademicStore } from '@/stores/academics.js';

  export default {
    components: {
      LoadingComponent,
      PaginationComponent
    },
    data() {
      return {
        activeButton: null,
        headers: [
          { text: '卷', value: '', width: '10%' },
          { text: '期', value: '', width: '10%'  },
          { text: '發行日期', value: 'release_at', width: '10%'  },
          { text: '標題', value: '', width: '10%'  },
          { text: '最後修改日期', value: 'updated_at', width: '10%'  },
          { text: '', value: '', width: '10%', sortable: false }
        ],
        tableItems:[],
        search: '',
        page: 1,
        perPage: 10,
        selectedYear: null,
        loading: false,
        paginations: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 1,
        },
        keyword: '',
        sortBy: 'release_at',
        sortDirection: 'DESC'
      }
    },
    created(){
      const store = useAcademicStore()
      const { paginations } = storeToRefs(store);
      this.paginations = paginations
    },
    mounted() {
      this.searchAcademicsList()
    },
    computed: {
      paginatedItems() {
        const start = (this.page - 1) * this.perPage
        const end = start + this.perPage
        return this.tableItems.slice(start, end)
      },
      pages() {
        return Math.ceil(this.tableItems.length / this.perPage)
      }
    },
    methods: {
      // api
      async searchAcademicsList(){
        this.loading = true
        const obj = {
          title: '',
          relseaseStartDate: '',
          relseaseEndDate: '',
          year: null,
          createdStartAt: '',
          createdEndAt: '',
          page: this.paginations.currentPage,
          pageSize: 10,
          sortBy: this.sortBy,
          sortDirection: this.sortDirection
        }
        academicsSrv.searchAcademicsList(obj).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              this.tableItems = res.data.data;
              this.paginations = res.data.pagination;

              const store = useQuarterStore()
              store.updatePagination(this.paginations);
            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          } else {
            // api 回傳失敗
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          }
        }).catch((error) => {
          // 處理錯誤情況
          Swal.fire({
              toast: true,
              position: 'center',
              title: '伺服器錯誤，請稍後再試',
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
        }).finally(() => {
          // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
          this.loading = false;
        });
      },
      async getAcademicsDetail(id){
        try{
          academicsSrv.getAcademicsDetail(id).then((res) => {
            if(res.isSuccess){
              const editData = res.data.data[0]
              const store = useAcademicStore()
              store.updateEditData(editData);
              this.editAcademicItem()
            }else{
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonText: '確認',
              });
            }
          })
        }catch(error){
          Swal.fire({
            toast: true,
            position: 'center',
            title: `伺服器錯誤，請聯絡開發人員`,
            confirmButtonText: '確認',
          });
        }
      },
      async keywordSearch(){
        this.loading = true
        try{
          const obj = {
            keyWord: this.keyword || '',
            sortBy: 'release_date',
            sortDirection: 'DESC'
          }
          academicsSrv.associationKeywordSearch(obj).then((res) => {
            console.log(res)
            if(res.isSuccess){
              this.tableItems = res.data.associations;
            }else{
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonText: '確認',
              });
            }
          })
        }catch(error){
          Swal.fire({
            toast: true,
            position: 'center',
            title: `伺服器錯誤，請聯絡開發人員`,
            confirmButtonText: '確認',
          });
        }finally{
          this.loading = false
        }
      },
      deleteAcademicsItem(id) {
        try{
          const obj = {
            academicId: id
          }

          this.loading = true

          academicsSrv.deleteAcademicsItem(obj).then((res) => {
            if(res.isSuccess){
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonText: '確認',

                showCancelButton : true,
                cancelButtonText: '取消'

              }).then((result) => {
                if(result.isConfirmed){
                  this.searchAcademicsList()
                }
              });
            }else{
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonText: '確認',
              });
            }
          })
        }catch(error){
          Swal.fire({
            toast: true,
            position: 'center',
            title: `伺服器錯誤，請聯絡開發人員`,
            confirmButtonText: '確認',
          });
        }finally{
          this.loading = false
        }
      },
      // functions
      addAcademicItem() {
        this.$router.push({
          path: '/admin/academicView',
          query: {
            action: 'add' // 添加 query 參數
          }
        });
      },
      editAcademicItem(item) {
        this.$router.push({
          path: '/admin/academicView',
          query: {
            action: 'edit' // 添加 query 參數
          }
        });
      },
      setNewPage(page){
        this.paginations.currentPage = page
        this.searchAcademicsList()
      },
      sortDBList(header) {
        
        if(header.value === ''){
          return
        }

        // 排序邏輯
        this.loading = true
        // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
        if (header.value !== this.sortBy) {
            this.headers.forEach((item) => item.sort = '');
        };
        // 找出哪個欄位要排序，給予對應的條件值
        const idx = this.headers.findIndex((item) => item.value === header.value);
        if (idx !== -1) {
            this.headers[idx].sort = header.sort ? (header.sort === 'ASC' ?  'DESC' : 'ASC') : 'DESC';
            
            this.sortBy = header.value;
            this.sortDirection = this.headers[idx].sort;
        };
        // 重置頁面
        this.paginations.currentPage = 1;
        this.tableItems = []

        this.searchAcademicsList();
      },
      deleteAcademicsItemCheck(id){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `確定要刪除?`,
          text: '刪除後將無法復原',
          confirmButtonText: '確認',

          showCancelButton : true,
          cancelButtonText: '取消'

        }).then((result) => {
          if(result.isConfirmed){
            this.deleteAcademicsItem(id)
          }
        });
      },
      // helpers
      formatDate(date) {
        const covertedDate = date.split('T')[0]
        return covertedDate
      },
      
    }
  }
</script>
    
<style scoped>
    
  .flex-container {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .v-data-table .v-data-table-header th {
    background-color: #f5f5f5;
    text-align: center;
  }
  .v-data-table .v-data-table__wrapper {
    max-height: 500px;
  }
  
  .v-table th,
  .v-table td {
    padding: 8px;
  }
  
  .v-table thead {
    background-color: #f5f5f5;
  }
  
  .text-style {
    font-size: 16px;
    font-weight: 600;
    color: #1b2482;
  }
  .no-wrap {
    white-space: nowrap; /* 避免文字斷行 */
    text-align: start;
  }
  
  .lvColor {
    background-color: #111;
    border-radius: 0px 10px 0px 10px;
    color: #fff !important;
    font-weight: 600;
    font-size: 14px;
    padding: 4px;
    width: 52px;
  }
  .content {
    padding: 3px 0px 3px 0px;
    justify-content: center !important;
  }
  
  .v-container {
    padding: 16px 16px 0px 0px;
  }
  
  .v-pagination__list {
    justify-content: flex-start !important;
  }
  
  .v-table {
    background-color: transparent !important;
    width: 100% !important;
  }
  .thead {
    background-color: transparent !important;
  }
  
  .paid {
    color: #111;
  }
  
  .unpaid {
    color: #ff2424;
  }
  
  .hover-effect {
    transition: background-color 0.3s ease;
  }
  
  .hover-effect:hover {
    background-color: #dddeea;
    cursor: pointer; /* 滑鼠懸停時顯示指針 */
  }
  
  .v-chip.v-chip--size-default{
    padding: 0px;
  }
  
  .custom-pagination {
    justify-content: start;
    width: 50%;
    margin: 20px 0px 0px 0px;
  }
  :deep(.v-pagination__list){
    justify-content: start;
    padding: 0px;
  }
  
  :deep(.v-pagination__item--is-active){
    background-color: #111;
    color:#fff;
    border-radius: 4px;
  }
  .custom-select{
    width: 160px;
  }
</style>
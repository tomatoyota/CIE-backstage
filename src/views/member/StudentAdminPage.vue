<template>
  <div class="relative">
    <v-form>
      <v-row class="py-4">
        <v-col>
          <v-text-field 
          v-model="searchCondition.frontUserId" 
          variant="outlined" 
          label="證號" 
          hide-details 
          class="search-theme"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field 
          v-model="searchCondition.name" 
          variant="outlined" 
          label="姓名" 
          hide-details
          class="search-theme"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select 
          label="級別" 
          :items="levelList" 
          item-title="name"
          item-value="level"
          v-model="searchCondition.level" 
          variant="outlined" 
          hide-details 
          class="search-theme"
          ></v-select>
        </v-col>
        <v-col>
          <v-select 
          label="當年繳費況狀" 
          :items="paymentStatusList" 
          item-title="name"
          item-value="value"
          v-model="searchCondition.paymentStatus" 
          variant="outlined" 
          hide-details 
          class="search-theme"
          ></v-select>
        </v-col>
        <v-col>
          <v-select label="顯示筆數" 
          :items="listAmount" 
          v-model="searchCondition.pageSize" 
          variant="outlined" 
          hide-details 
          class="search-theme"
          ></v-select>
        </v-col>
        <v-col class="d-flex align-center">
          <v-col class="py-0 pr-1 pl-0">
            <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
          </v-col>
          <v-col class="py-0 pl-2 pr-0">
            <v-btn class="w-100" flat color="success" @click="searchGroupMemberList(1)">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col class="text-right">
        <v-btn color="primary" flat @click="addMember()">
          新增會員
        </v-btn>
      </v-col>
    </v-row>

    <!-- 國教院的範本，如果要使用這個範本整段打開就可以用了，記得要把下面的 pagination 關起來 -->
    <!-- <div class="mt-7 d-flex align-end justify-space-between">
      <v-row class="align-center" no-gutters>
        <p class="mb-0 mr-2">共{{ paginations.totalCount }}筆</p>
        <v-col>
          <PaginationComponent
            :pageLength="paginations.totalPages"
            :current-page="paginations.currentPage"
            @get-list="searchStudentMember"
            @set-page="setPage"
          ></PaginationComponent>
        </v-col>
      </v-row>
    </div> -->

    <v-table
      class="mt-4 mb-2"
      :height="paginatedItems.length > 10 ? '550px' : ''"
      :fixed-header="paginatedItems.length > 10"
    >
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.value" class="no-wrap">{{ header.text }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" :key="item.id" class="hover-effect">
          <td class="no-wrap">{{ item.id }}</td>
          <td class="no-wrap">{{ item.name }}</td>
          <td class="no-wrap">{{ item.email }}</td>
          <td class="no-wrap">{{ item.date }}</td>
          <td class="no-wrap">
            <v-chip variant="text"
              ><v-icon :style="{ color: getStatusColor(item.status) }">mdi mdi-circle-medium</v-icon
              >{{ item.status }}</v-chip
            >
          </td>
          <td class="no-wrap">
            <v-btn variant="outlined" class="text-style" @click="editItem(item)">設定代號</v-btn>
            <v-btn variant="text" class="text-style" @click="deleteItem(item)">查看申請表</v-btn>
            <v-btn variant="text" class="text-style" @click="deleteItem(item)">刪除申請</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <PaginationComponent
      :pageLength="paginations.totalPages"
      :current-page="paginations.currentPage"
      @get-list="searchStudentMember"
      @set-page="setPage"
    ></PaginationComponent>
    
  </div>
  <LoadingComponent :loading="loading" />
</template>

<script>
import { defineComponent } from 'vue'
import studentSrv from '@/service/studentMember.js'
import Swal from '@/utils/sweetAlert';
import PaginationComponent from '@/components/PaginationComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js'

export default {
  components: {
    PaginationComponent,
    LoadingComponent
  },
  data() {
    return {
      tab: 3,
      buttons: [
        { id: 1, label: '會員列表', variant: 'outlined' },
        { id: 2, label: '資料列印', variant: 'outlined' },
        { id: 3, label: '年費繳交註記', variant: 'outlined' }
      ],
      activeButton: null,
      searchCondition: {
        frontUserId: '',
        name: '',
        level: null,
        paymentStatus: null,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        page: 1,
        size: 500
      },
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ],
      headers: [
        { text: '序號', value: 'id' },
        { text: '姓名', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: '申請日期', value: 'date' },
        { text: '審核狀態', value: 'status' },
        { text: '', value: 'actions', sortable: false }
      ],
      paginations: {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      tableItems: [],
      search: '',
      loading: false,
    }
  },
  mounted() {
    this.searchStudentMember()
  },
  computed: {
    paginatedItems() {
      const start = (this.page - 1) * this.perPage
      const end = start + this.perPage
      return this.items.slice(start, end)
    },
  },
  methods: {
    
    async searchStudentMember(){
      this.loading = true
      try{
        const frontUserId = this.searchCondition.frontUserId || ''
        const name = this.searchCondition.name || ''
        const level = this.searchCondition.level || ''
        const paymentStatus = this.searchCondition.paymentStatus || ''
        const page = this.paginations.currentPage
        const size = this.searchCondition.size
        const sortField = 'created_at'
        const sortOrder = 'DESC'
        
        await studentSrv.searchStudentMember(frontUserId, name, level, paymentStatus, page, size, sortField, sortOrder).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              this.tableItems = res.data.data
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
              title: `${res.data.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            });
          }
        }).catch((error) => {
          // 處理錯誤情況
          console.error('Error:', error);
        }).finally(() => {
          // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
          this.loading = false;
        });
      }catch(error){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
    },
    addMember() {
      this.$router.push({
        path: '/admin/studentView',
        query: {
          action: 'add'
        }
      });
    },
    getStatusColor(status) {
      switch (status) {
        case '完成審核，待設定證號':
          return '#73E14C'
        case '審核中':
          return '#FCAF15'
        case '申請中':
          return '#6E6E6E'
        default:
          return '#000'
      }
    },
    handleButtonClick(buttonId) {
      this.activeButton = buttonId
    },

    checkCheckbox() {
      if (this.checkAllItem) {
        this.checkItem = this.tableItems.map((item) => item.id)
      } else {
        this.checkItem = []
      }
    },
    sortDBList(header) {
      // 排序邏輯
    },
    getStatusClass(status) {
      return {
        'text-success': status === '已編輯',
        'text-error': status !== '已編輯'
      }
    },
    transferStatus(status) {
      return status === '已編輯' ? '已編輯' : '未編輯'
    },
  },
}
</script>

<style scoped>
.flex-container {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addBtn {
  padding: 12px 24px 12px 24px;
  border-radius: 4px;
  width: 112px;
  height: 48px;
  background: #1b2482;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  position: absolute;
  top: -60px;
  right: 0;
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

.v-chip.v-chip--size-default {
  padding: 0px;
}

.custom-pagination {
  justify-content: start;
  width: 50%;
  margin: 20px 0px 0px 0px;
}
:deep(.v-pagination__list) {
  justify-content: start;
  padding: 0px;
}

:deep(.v-pagination__item--is-active) {
  background-color: #111;
  color: #fff;
  border-radius: 4px;
}
.relative {
  position: relative;
}
</style>
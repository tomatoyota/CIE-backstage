<template>
  <div class="bg-whitw pa-4">
    <div class="custom-container">
    <button @click="changeTab(1)" :class="['tab-button', activeTab === 1 ? 'active' : '']">最新消息</button>
    <button @click="changeTab(2)" :class="['tab-button', activeTab === 2 ? 'active' : '']">公告事項</button>
    <button @click="changeTab(3)" :class="['tab-button', activeTab === 3 ? 'active' : '']">季刊公告</button>
    <button @click="changeTab(4)" :class="['tab-button', activeTab === 4 ? 'active' : '']">活動剪影</button>
  </div>
    <v-form>
      <v-row class="py-4">
        <v-col cols="4" class="py-2">
          <v-text-field
            v-model="searchCondition.announcementTitle"
            variant="outlined"
            label="公告標題"
            class="search-theme"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="3" class="py-2">
          <VueDatePicker
            label="發布日期"
            class="search-theme"
            v-model="searchCondition.releaseAt"
            range
            :teleport="true"
            format="yyyy/MM/dd"
            placeholder="發布日期"
            :text-input="releaseAtInputOptions"
            :enable-time-picker="false"
          >
          </VueDatePicker>
        </v-col>
        <!-- <v-col cols="3" class="py-2">
          <VueDatePicker
            label="下架日期"
            v-model="searchCondition.expiredDate"
            range
            :teleport="true"
            format="yyyy/MM/dd"
            placeholder="下架日期"
            :text-input="expiredDateInputOptions"
            :enable-time-picker="false"
          >
          </VueDatePicker>
        </v-col> -->
        <!-- <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.type" variant="outlined" label="發布單位" hide-details></v-text-field>
        </v-col> -->
        <v-col cols="2" class="py-2">
          <VueDatePicker
            label="建立日期"
            v-model="searchCondition.createDate"
            range
            :teleport="true"
            format="yyyy/MM/dd"
            placeholder="建立日期"
            class="search-theme"
            :text-input="createDateInputOptions"
            :enable-time-picker="false"
          >
          </VueDatePicker>
        </v-col>
        <!-- <v-col cols="2" class="py-2">
          <v-text-field
            v-model="searchCondition.announcementType"
            variant="outlined"
            label="type"
            class="search-theme"
            hide-details
          ></v-text-field>
        </v-col> -->
        <v-col cols="3" class="d-flex">
          <v-col class="py-0 pl-0">
            <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
          </v-col>
          <v-col class="py-0 pr-0">
            <v-btn class="w-100" flat color="success" @click="searchAnnouncement(1)">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>
    <!-- <div class="title">公告管理</div> -->

    <div class="mt-7 d-flex align-end justify-space-between">
      <div class="ms-auto">
        <v-btn class="addBtn" flat><RouterLink to="/admin/announcementView">新增文章</RouterLink></v-btn>
      </div>
    </div>

    <v-table class="mt-4">
      <thead>
        <tr>
          <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
            <a
              href="#"
              class="text-decoration-none text-darkprimary d-flex align-center"
              @click.prevent="sortDBList(header)"
              :class="header.value !== '' ? '' : 'noCursor'"
            >
              {{ header.title }}
              <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'ASC'"></v-icon>
              <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'DESC'"></v-icon>
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" class="hover-effect">
          <td>{{ item.title }}</td>
          <td>{{ item.createdBy }}</td>
          <td>{{ formatDate(item.releaseAt) }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td class="text-center no-wrap" style="width: 400px">
            <a href="#" @click.prevent="editAccouncement(item.announcementsId)">
              <v-tooltip text="編輯最新消息" location="bottom">
                <template v-slot:activator="{ props }">
                  <!-- <v-icon v-bind="props" class="mdi mdi-pencil" x-large></v-icon> -->
                  <v-btn variant="outlined" class="text-style" v-bind="props">編輯</v-btn>
                </template>
              </v-tooltip>
            </a>
            
            <v-btn variant="text" class="text-style" @click="deleteAccouncement(item.announcementsId)">刪除</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <LoadingComponent :loading="loading" />

    <v-row class="align-center" no-gutters>
      <!-- <p class="mb-0 mr-2" v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p> -->
      <v-col>
        <PaginationComponent :currentPage="paginations.currentPage" :pageLength="paginations.totalPages" circle class="custom-pagination" @setPage="setPage"></PaginationComponent>
        
        <!-- <PaginationComponent
          :pageLength="paginations.totalPages"
          :current-page="paginations.currentPage"
          @get-list="searchAnnouncement"
          @set-page="setPage"
        ></PaginationComponent> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { userAnnouncementStore } from '@/stores/Announcement.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import announcementSrv from '@/service/announcement.js';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import { useRoute } from 'vue-router';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ConsoleSqlOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    VueDatePicker,
    PaginationComponent,
    LoadingComponent
  },
  data() {
    return {
      activeTab: 1,
      searchCondition: {
        announcementTitle: '',
        releaseAt: [],
        announcementType: '1', // 預設為最新消息
        createAt: [],
        expiredDate: [],
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      },
      roleName: [],
      roleStatus: [],
      tableItems: [],
      publishDialog: false,
      roleAccountDialog: false,
      sortBy: '',
      sortOrder: '',

      paginations: [
        {
          currentPage: 1,
          totalCount: 0,
          totalPages: 1
        },
      ],
      loading: false,
      headers: [
        {
          title: '標題',
          value: '',
          sort: '',
          width: '30%'
        },
        {
          title: '發布單位',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '發布日期',
          value: 'release_date',
          sort: '',
          width: '15%'
        },

        {
          title: '建立日期',
          value: 'created_at',
          sort: '',
          width: '15%'
        },
        {
          title: '',
          value: '',
          sort: '',
          width: '10%'
        }
      ],
      releaseAtInputOptions: {
        rangeSeparator: ''
      },
      createDateInputOptions: {
        rangeSeparator: ''
      },
      expiredDateInputOptions: {
        rangeSeparator: ''
      },
      pageId: 16,
      pagePermissions: []
    };
  },
  created() {
    const store = userAnnouncementStore();
    const { searchCondition, editViewTableItem, paginations } = storeToRefs(store);
    // 搜尋欄位狀態儲存
    if (searchCondition) {
      this.searchCondition = searchCondition;
    }
    // table 狀態儲存
    if (editViewTableItem) {
      this.tableItems = editViewTableItem;
    }
    if (paginations) {
      this.paginations = paginations.value[this.activeTab - 1];
    }
    // 路由或外層傳入的 type 值初始化
    // const route = useRoute();
    // if (route.query.type) {
    //   this.searchCondition.type = route.query.type;
    // }

    // 自動進行初次搜尋
    // this.searchAnnouncement(1);
  },
  mounted() {

    // this.getPagePermission();
    localStorage.removeItem('isEdit');
    localStorage.removeItem('editData');
  //   const store = userAnnouncementStore();
  //   const route = useRoute();

  //   // 如果有查詢參數並且 action 為 'reset'，則重置路由並清除 store
  //   if (Object.keys(route.query).length && route.query.action === 'reset') {
  //     this.$router.replace(route.path);
  //     store.$reset();
  //     return;
  //   }

    // 自動搜尋，並將排序條件設為 'updatedAt' 並按倒序排列
    // this.searchCondition.sortBy = 'updatedAt';
    // this.searchCondition.sortDirection = 'DESC';

    // // 檢查 sessionStorage 中的標記，防止無限重整
    // if (!sessionStorage.getItem('reloaded')) {
    //   // 設定標記，表示已重整過
    //   sessionStorage.setItem('reloaded', 'true');
    //   // 重整頁面
    //   location.reload();
    // } else {
    //   // 如果已經重整過，清除標記以便下次進入時可以再重整
    //   sessionStorage.removeItem('reloaded');
    //   // 其他初始化動作，例如呼叫搜尋函數
    //   this.searchAnnouncement(1);
    // }

    // 取 type
    const store = userAnnouncementStore();
    const pageTypeStore = store.searchCondition
    const pageType = pageTypeStore.type;
    this.changeTab(pageType);
    

    // 在這裡處理排序邏輯
  },
  watch: {
    // 當 searchCondition.type 改變時，自動觸發搜尋
    // 'searchCondition.type': {
    //   handler(newType) {
    //     this.searchAnnouncement(); // 當類型改變時進行搜尋
    //   },
    //   immediate: true // 保證一開始就執行
    // },

    activeTab(newVal) {
      this.page = 1;
      this.searchAnnouncement();
    },
    
    searchCondition: {
      handler(newValue) {
        const store = userAnnouncementStore();
        store.updateSearchCondition(newValue);
      },
      deep: true
    },
    tableItems: {
      handler(newValue) {
        const store = userAnnouncementStore();
        store.updateEditViewTableItem(newValue);
      },
      deep: true
    },
    // paginations: {
    //   handler(newValue) {
    //     const store = userAnnouncementStore();
    //     store.updatePagination(newValue);
    //   },
    //   deep: true
    // },
    // 'paginations.currentPage': 'fetchPageData',
    'searchCondition.releaseAt': {
      handler(val) {
        if (val && val[1] !== null) {
          this.releaseAtInputOptions.rangeSeparator = '-';
        } else {
          this.releaseAtInputOptions.rangeSeparator = '';
        }
      },
      deep: true
    },
    'searchCondition.expiredDate': {
      handler(val) {
        if (val && val[1] !== null) {
          this.expiredDateInputOptions.rangeSeparator = '-';
        } else {
          this.expiredDateInputOptions.rangeSeparator = '';
        }
      },
      deep: true
    },
    'searchCondition.createDate': {
      handler(val) {
        if (val && val[1] !== null) {
          this.createDateInputOptions.rangeSeparator = '-';
        } else {
          this.createDateInputOptions.rangeSeparator = '';
        }
      },
      deep: true
    }
  },
  
  methods: {
    getPagePermission() {
      const id = 16;
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
      const obj = {
        userAccount: user.backendUserAccount
      };
      userPagePermissionSrv.getUserPagePermission(id, obj).then((res) => {
        res.data.data.permissions.forEach((i) => {
          this.pagePermissions.push(i.permissionId);
        });
      });
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
    
    changeTab(type) {
      this.activeTab = type;
      const store = userAnnouncementStore();
      const { paginations } = storeToRefs(store);
      this.paginations = paginations.value[this.activeTab - 1];
      this.searchCondition.type = type;
      store.updateType(type);
      // this.searchAnnouncement();
    },

    searchAnnouncement(pageNumber) {
      this.loading = true;
      let createdStartAt = '';
      let createdEndAt = '';
      if (this.searchCondition.createDate && this.searchCondition.createDate.length > 0) {
        createdStartAt = this.formatSeachDate(this.searchCondition.createDate[0]);
        createdEndAt = this.searchCondition.createDate[1]
          ? this.formatSeachDate(this.searchCondition.createDate[1])
          : this.formatSeachDate(this.searchCondition.createDate[0]);
      }

      let releaseStartDate = '';
      let releaseEndDate = '';
      if (this.searchConditiAt && this.searchCondition.releaseAt.length > 0) {
        releaseStartDate = this.formatSeachDate(this.searchCondition.releaseAt[0]) || '';
        releaseEndDate = this.searchCondition.releaseAt[1]
          ? this.formatSeachDate(this.searchCondition.releaseAt[1])
          : this.formatSeachDate(this.searchCondition.releaseAt[0]);
      }

      let expiredStartDate = '';
      let expiredEndDate = '';
      if (this.searchCondition.expiredDate && this.searchCondition.expiredDate.length > 0) {
        expiredStartDate = this.formatSeachDate(this.searchCondition.expiredDate[0]) || '';
        expiredEndDate = this.searchCondition.expiredDate[1]
          ? this.formatSeachDate(this.searchCondition.expiredDate[1])
          : this.formatSeachDate(this.searchCondition.expiredDate[0]);
      }

      // 頁數跟數量
      let page = null;
      if (pageNumber) {
        page = pageNumber;
      } else {
        page = this.paginations.currentPage;
      }
      const pageSize = this.searchCondition.pageSize;

      // 排序
      const sortBy = this.searchCondition.sortBy || '';
      const sortOrder = this.searchCondition.sortDirection || '';

      
      const obj = {
        title: this.searchCondition.announcementTitle || '',
        releaseStartDate: releaseStartDate || '',
        releaseEndDate: releaseEndDate || '',
        expiredStartDate: expiredStartDate || '',
        expiredEndDate: expiredEndDate || '',
        // type: this.searchCondition.type || '',
        type: this.activeTab,
        createdStartAt: createdStartAt || '',
        createdEndAt: createdEndAt || '',
        page: page,
        pageSize: 10,
        sortBy: sortBy,
        sortDirection: sortOrder
        // sortBy: this.searchCondition.sortBy || '', // 使用 sortBy 條件
        // sortDirection: this.searchCondition.sortDirection || '' // 使用 sortDirection 條件
      };
      for (const key in obj) {
        if (obj[key] === '') {
          delete obj[key];
        }
      }
      announcementSrv.searchAnnouncement(obj).then((res) => {
        // api 回傳成功
        if (res.isSuccess) {
          // rtnCode 為 0000 的情況
          if(res.data.rtnCode === '0000'){
            this.tableItems = res.data.data;
            this.paginations = res.data.pagination;
            
            const store = userAnnouncementStore()
            store.updatePagination(this.paginations, this.activeTab);
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
        console.error('Error:', error);
      }).finally(() => {
        // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
        this.loading = false;
      });
    },

    clearSearch() {
      const currentType = this.searchCondition.type;
      (this.searchCondition.announcementTitle = ''),
        (this.searchCondition.createDate = []),
        (this.searchCondition.releaseAt = []),
        (this.searchCondition.page = 1),
        (this.searchCondition.type = currentType),
        (this.pageSize = 10),
        (this.sortBy = ''),
        (this.sortOrder = '');
    },
    formatTime(value) {
      return value.split('T')[0];
    },
    setPage(page) {
      const store = userAnnouncementStore();
      store.updateCurrentPage(page, this.activeTab);
      // store.value = page;

      this.paginations.currentPage = page;
      this.searchAnnouncement();
    },
    editAccouncement(id) {
      announcementSrv.getAnnouncement(id).then((res) => {
        const editData = JSON.stringify(res.data.data);
        // console.log(editData);
        localStorage.setItem('editData', editData);
        localStorage.setItem('isEdit', true);
        this.$router.push('/admin/announcementView');
      });
    },
    // async deleteAccouncement(announcementsId) {
    //   try {
    //     const confirmed = confirm("確定要刪除這項公告嗎？");
    //     if (!confirmed) return;

    //     // 假設你有一個 deleteAnnouncement 方法來調用 API
    //     await this.deleteAnnouncement(announcementsId);
        
    //     // 刪除成功後從 tableItems 中移除該項目
    //     this.tableItems = this.tableItems.filter(item => item.announcementsId !== announcementsId);
    //     alert("刪除成功！");
    //   } catch (error) {
    //     console.error("刪除失敗：", error);
    //     alert("刪除失敗，請稍後再試。");
    //   }
    // },

    async deleteAccouncement(announcementsId) {
      try {
        const confirmed = await Swal.fire({
          title: '確定要刪除這項公告嗎？',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確定',
          cancelButtonText: '取消'
        });

        if (confirmed.isConfirmed) {
          // 調用 API 刪除公告
          const res = await announcementSrv.deleteAnnouncement(announcementsId);
          
          // 確認 API 回傳成功
          if (res.isSuccess && res.data.rtnCode === '0000') {
            // 刪除成功後從 tableItems 中移除該項目
            this.tableItems = this.tableItems.filter(item => item.announcementsId !== announcementsId);
            Swal.fire('刪除成功', '', 'success');
          } else {
            Swal.fire('刪除失敗', res.data.rtnMsg || '請稍後再試', 'error');
          }
        }
      } catch (error) {
        console.error("刪除失敗：", error);
        Swal.fire('刪除失敗', '請稍後再試', 'error');
      }
    },
    sortDBList(header) {
      // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
      if (header.value === '') {
        return;
      }
      if (header.value !== this.searchCondition.sortBy) {
        this.headers.forEach((item) => (item.sort = ''));
      }
      // 找出哪個欄位要排序，給予對應的條件值
      const idx = this.headers.findIndex((item) => item === header);
      if (idx !== -1) {
        this.headers[idx].sort = header.sort ? (header.sort === 'ASC' ? 'DESC' : 'ASC') : 'DESC';
        this.searchCondition.sortBy = header.value;
        this.searchCondition.sortDirection = this.headers[idx].sort;
        this.paginations.currentPage = 1;
        this.searchAnnouncement();
      }
      this.searchAnnouncement();
    },
    formatSeachDate(date) {
      if (date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
      }
    }
  }
};
</script>
<style lang="scss">
.v-btn--disabled.v-btn--variant-elevated .v-btn__overlay {
  opacity: 0;
}
a {
  text-decoration: none;
  color: inherit;
}

.search-theme {
  background-color: #dddeea !important;
  // width: 600px;
  // margin-bottom: 26px;
  // padding-left: 10px;
  border-radius: 4px;
  // padding-bottom: 5px;
}

.dp__input {
  background-color: #dddeea !important;
  border-radius: 4px;
}

.addBtn {
  padding: 12px 24px 12px 24px;
  border-radius: 4px;
  width: 112px;
  height: 48px !important;
  background: #1b2482;
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
}
.custom-container {
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000;
  display: inline-block;
  /* margin-bottom: 30px; */
}
.tab-button {
  height: 48px;
  border-top: 1px solid #6E6E6E;
  border-left: 1px solid #6E6E6E;
  border-right: 1px solid #6E6E6E;
  border-radius: 4px 4px 0 0; /* 上方圓角 */
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #222;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 14px;
  font-weight: 400;
  margin-right: 8px !important;
}
.tab-button:last-child {
  margin-right: 0 !important;
}
.tab-button:focus,
.tab-button.active {
  transition: background-color 0.3s ease;
  background-color: black;
  color: white;
}

.hover-effect:hover {
  background-color: #dddeea;
  cursor: pointer; /* 滑鼠懸停時顯示指針 */
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
</style>
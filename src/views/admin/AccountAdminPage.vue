<template>
  <div class="">
    <v-form>
      <v-row class="py-4">
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.username" variant="outlined" label="使用者帳號" hide-details></v-text-field>
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
          <v-text-field v-model="searchCondition.creator" variant="outlined" label="建立者帳號" hide-details></v-text-field>
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
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.editor" variant="outlined" label="修改者帳號" hide-details></v-text-field>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-select
            v-model="searchCondition.selectedStatus"
            :items="statusList"
            item-title="label"
            item-value="id"
            variant="outlined"
            label="狀態"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-select
            v-model="searchCondition.selectedRole"
            :items="roleName"
            item-title="roleName"
            item-value="roleId"
            variant="outlined"
            label="角色"
            hide-details
            multiple
          ></v-select>
        </v-col>
        <v-col cols="3" class="d-flex">
          <v-col class="py-0 pl-0">
            <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
          </v-col>
          <v-col class="py-0 pr-0">
            <v-btn class="w-100" flat color="success" @click="searchUser(1)">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>
    <div class="title">AccountAdminPage</div>
    <iconify-icon icon="material-symbols:content-copy-outline"></iconify-icon>
    <iconify-icon icon="material-symbols:content-copy"></iconify-icon>
    <div class="mt-7 d-flex align-end justify-space-between">
      <v-row class="align-center" no-gutters>
        <!-- <p class="mb-0 mr-2" v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p> -->
        <v-col>
          <PaginationComponent
            :pageLength="paginations.totalPages"
            :current-page="paginations.page"
            @get-list="searchUser"
            @set-page="setPage"
          ></PaginationComponent>
        </v-col>
      </v-row>

      <div class="ms-auto">
        <v-btn class="mr-2" flat color="#1976D2"><RouterLink to="/admin/addAccount">新增帳號</RouterLink></v-btn>
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
          <td class="copy-effect">
            {{ item.backendUserAccount }}
            <button @click="copy" class="ml-4 copy-btn">
              <v-icon icon="mdi mdi-content-copy" size="x-small"></v-icon>
            </button>
          </td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>{{ item.creator }}</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>{{ item.editor }}</td>
          <td>
            <v-switch
              color="primary"
              hide-details
              density="comfortable"
              v-model="item.accountStatus"
              @click.prevent="publishView(item.accountStatus ? '禁用' : '啟用', item)"
            ></v-switch>
          </td>
          <td>
            <span class="mr-2" v-for="roleItem in item.roles">
              {{ roleItem.roleName }}
            </span>
          </td>
          <td class="text-center" style="width: 400px">
            <a href="#" @click.prevent="editUser(item.backendUserAccount)">
              <v-tooltip text="編輯帳號" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-pencil" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="changePassword(item)">
              <v-tooltip text="修改密碼" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-form-textbox-password me-2" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <LoadingComponent :loading="loading" />
  <!-- 角色啟用/禁用 -->
  <v-dialog v-model="publishDialog" max-width="500px" persistent>
    <PublishToggleComponent
      @close-dialog="publishDialog = false"
      @get-list="searchUser"
      @reset-toggle="resetToggle"
      :action-type="publishTitle"
      :toggle-user="toggleUser"
    ></PublishToggleComponent>
  </v-dialog>

  <v-dialog v-model="changePasswordDialog" max-width="500px" persistent>
    <changePasswordComponent :userInfo="selectedUserInfo" @close-dialog="changePasswordDialog = false"></changePasswordComponent>
  </v-dialog>
</template>

<script>
import { storeToRefs } from 'pinia';
import { userAccountStore } from '@/stores/UserAccount.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import PublishToggleComponent from '@/components/userAccount/ToggleComponent.vue';
import RoleAccountComponent from '@/components/rolePermission/RoleAccountComponent.vue';
import accountSrv from '@/service/account.js';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import changePasswordComponent from '@/components/userAccount/changePasswordComponent.vue';
import { useRoute } from 'vue-router';
import LoadingComponent from '@/components/LoadingComponent.vue';
import useClipboard from 'vue-clipboard3';
import 'iconify-icon';

export default {
  components: {
    VueDatePicker,
    PaginationComponent,
    PublishToggleComponent,
    RoleAccountComponent,
    changePasswordComponent,
    LoadingComponent
  },
  data() {
    return {
      searchCondition: {
        selectedRole: null,
        createDate: [],
        updateDate: [],
        creator: '',
        editor: '',
        sortBy: '',
        sortDirection: '',
        selectedStatus: null,
        page: 1,
        pageSize: 10,
        sortBy: '',
        sortDirection: ''
      },
      roleName: [],
      roleStatus: [],
      tableItems: [],
      publishDialog: false,
      roleAccountDialog: false,
      sortBy: '',
      sortOrder: '',
      paginations: {
        page: 1,
        totalCount: 0,
        totalPages: 1
      },
      toggleWord: '',
      publishTitle: '',
      loading: false,
      statusList: [
        {
          label: '啟用',
          id: '0'
        },
        {
          label: '禁用',
          id: '1'
        }
      ],
      changePasswordDialog: false,
      selectedUserInfo: null,
      headers: [
        {
          title: '使用者帳號',
          value: 'backend_user_account',
          sort: '',
          width: '10%'
        },
        {
          title: '建立時間',
          value: 'createdAt',
          sort: '',
          width: '15%'
        },
        {
          title: '建立者帳號',
          value: 'creator',
          sort: '',
          width: '10%'
        },
        {
          title: '修改時間',
          value: 'updatedAt',
          sort: '',
          width: '15%'
        },
        {
          title: '修改者帳號',
          value: 'editor',
          sort: '',
          width: '10%'
        },
        {
          title: '禁用 / 啟用',
          value: 'account_status',
          sort: '',
          width: '10%'
        },
        {
          title: '角色',
          value: '',
          sort: '',
          width: '10%'
        },
        {
          title: '',
          value: '',
          sort: '',
          width: '10%'
        }
      ],
      updateDateInputOptions: {
        rangeSeparator: ''
      },
      createDateInputOptions: {
        rangeSeparator: ''
      },
      pageId: 16,
      pagePermissions: []
    };
  },
  created() {
    const store = userAccountStore();
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
      this.paginations = paginations;
    }
  },
  watch: {
    searchCondition: {
      handler(newValue) {
        const store = userAccountStore();
        store.updateSearchCondition(newValue);
      },
      deep: true
    },
    tableItems: {
      handler(newValue) {
        const store = userAccountStore();
        store.updateEditViewTableItem(newValue);
      },
      deep: true
    },
    paginations: {
      handler(newValue) {
        const store = userAccountStore();
        store.updatePagination(newValue);
      },
      deep: true
    },
    'searchCondition.updateDate': {
      handler(val) {
        if (val && val[1] !== null) {
          this.updateDateInputOptions.rangeSeparator = '-';
        } else {
          this.updateDateInputOptions.rangeSeparator = '';
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
  setup() {
    const { toClipboard } = useClipboard();

    const copy = async () => {
      try {
        await toClipboard('Any text you like');
        console.log('Copied to clipboard');
      } catch (e) {
        console.error(e);
      }
    };

    return { copy };
  },
  mounted() {
    this.getRole();
    this.getPagePermission();
    localStorage.removeItem('userData');
    // 路由有帶參數 reset --> 才重置 pinia
    const store = userAccountStore();
    const route = useRoute();
    if (Object.keys(route.query).length && route.query.action === 'reset') {
      this.$router.replace(route.path);
      store.$reset();
      return;
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
    transformStatus(value) {
      switch (value) {
        case 0:
          return true;
        case 1:
          return false;
          break;
      }
    },
    previewRoleAccount() {
      this.roleAccountDialog = true;
    },
    changePassword(item) {
      this.selectedUserInfo = item;
      this.changePasswordDialog = true;
    },
    publishView(type, item) {
      this.publishDialog = true;
      this.publishTitle = type;
      this.toggleUser = item;
    },
    resetToggle(item) {
      item.publishToggle = !item.publishToggle;
    },
    searchUser(pageNumber) {
      this.loading = true;

      let createdAtStart = '';
      let createdAtEnd = '';
      if (this.searchCondition.createDate && this.searchCondition.createDate.length > 0) {
        createdAtStart = encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[0]) + 'T00:00:00') || '';
        createdAtEnd = this.searchCondition.createDate[1]
          ? encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[1]) + 'T23:59:59')
          : encodeURIComponent(this.formatSeachDate(this.searchCondition.createDate[0]) + 'T23:59:59');
      }

      let updatedAtStart = '';
      let updatedAtEnd = '';
      if (this.searchCondition.updateDate && this.searchCondition.updateDate.length > 0) {
        updatedAtStart = encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[0]) + 'T00:00:00') || '';
        updatedAtEnd = this.searchCondition.updateDate[1]
          ? encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[1]) + 'T23:59:59')
          : encodeURIComponent(this.formatSeachDate(this.searchCondition.updateDate[0]) + 'T23:59:59');
      }

      const username = this.searchCondition.username || '';
      const creator = this.searchCondition.creator || '';
      const editor = this.searchCondition.editor || '';
      const status = this.searchCondition.selectedStatus || '';
      let roleIdAry = [];

      if (this.searchCondition.selectedRole && this.searchCondition.selectedRole.length > 0) {
        this.searchCondition.selectedRole.forEach((i) => {
          roleIdAry.push(i);
        });
      } else {
        roleIdAry = null;
      }
      const roleIds = JSON.stringify(roleIdAry);

      // 頁數跟數量
      let page = null;
      if (pageNumber) {
        page = pageNumber;
      } else {
        page = this.paginations.page;
      }
      const pageSize = this.searchCondition.pageSize;

      // 排序
      const sortBy = this.searchCondition.sortBy || '';
      const sortOrder = this.searchCondition.sortDirection || '';
      accountSrv
        .backendUsersGet(
          username,
          createdAtStart,
          createdAtEnd,
          updatedAtStart,
          updatedAtEnd,
          creator,
          editor,
          status,
          roleIds,
          page,
          pageSize,
          sortBy,
          sortOrder
        )
        .then((res) => {
          this.loading = false;

          if (res.data.data) {
            res.data.data.forEach((i) => {
              i.accountStatus = this.transformStatus(i.accountStatus);
            });
          }
          this.tableItems = res.data.data;
          if (res.data.pagination) {
            this.paginations = res.data.pagination;
          }

          if (res.data.rtnCode === '0001') {
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
        });
    },
    clearSearch() {
      (this.searchCondition.username = ''),
        (this.searchCondition.createDate = []),
        (this.searchCondition.updateDate = []),
        (this.searchCondition.creator = ''),
        (this.searchCondition.editor = ''),
        (this.searchCondition.selectedStatus = null),
        (this.searchCondition.selectedRole = null),
        (this.searchCondition.page = 1),
        (this.pageSize = 10),
        (this.sortBy = ''),
        (this.sortOrder = '');
    },
    formatTime(value) {
      return value.split('T')[0];
    },
    setPage(page) {
      const store = userAccountStore();
      store.updateCurrentPage(page);
      store.value = page;
      this.paginations.page = page;
    },
    getRole() {
      accountSrv.getRole().then((res) => {
        this.roleName = res.data;
      });
    },
    editUser(name) {
      const obj = {
        backendUserAccount: name
      };
      accountSrv.getUser(obj).then((res) => {
        const userData = JSON.stringify(res.data.data);
        localStorage.setItem('userData', userData);
        this.$router.push('/admin/addAccount');
      });
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
        this.paginations.page = 1;
      }
      this.searchUser();
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
.hover-effect {
  transition: background-color 0.3s ease;
}

.hover-effect:hover {
  background-color: #dddeea;
  cursor: pointer; /* 滑鼠懸停時顯示指針 */
}
.copy-effect {
  transition: background-color 0.3s ease;
}

.copy-effect:hover {
  background-color: #1b248229;
  cursor: pointer; /* 滑鼠懸停時顯示指針 */
}
.copy-btn {
  display: none;
}
tr:hover .copy-btn {
  display: inline-block; /* 或 block 依據需求 */
}
</style>

<template>
  <div class="">
    <v-form>
      <v-row class="py-4">
        <v-col cols="3" class="py-2">
          <VueDatePicker
            label="送編時間"
            v-model="searchCondition.toEditDate"
            range
            :teleport="true"
            format="yyyy/MM/dd"
            placeholder="送編時間"
            :text-input="toEditInputOptions"
            :enable-time-picker="false"
          >
          </VueDatePicker>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.wordName" variant="outlined" label="字詞名" hide-details></v-text-field>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.pinyin" variant="outlined" label="漢語拼音" hide-details></v-text-field>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.zhuyin" variant="outlined" label="注音" hide-details></v-text-field>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.definition" variant="outlined" label="釋義" hide-details></v-text-field>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-select
            v-model="searchCondition.selectedEditStatus"
            :items="editStatus"
            item-title="editNameZh"
            item-value="editNumber"
            variant="outlined"
            label="編輯狀態"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="3" class="py-2">
          <v-text-field v-model="searchCondition.creator" variant="outlined" label="送編人員" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select label="顯示筆數" :items="listAmount" v-model="selectedListAmount" variant="outlined" hide-details></v-select>
        </v-col>
        <v-col cols="3" class="d-flex offset-9">
          <v-col class="py-0 pl-0">
            <v-btn class="w-100" flat color="error" @click="clearSearch()">清除</v-btn>
          </v-col>
          <v-col class="py-0 pr-0">
            <v-btn class="w-100" flat color="success" @click="searchWord(1)">搜尋</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-form>

    <div class="mt-7 d-flex align-end justify-space-between">
      <v-row class="align-center" no-gutters>
        <p class="mb-0 mr-2" v-if="paginations.totalCount">共{{ paginations.totalCount }}筆</p>
        <v-col>
          <PaginationComponent
            :pageLength="paginations.totalPages"
            :current-page="paginations.currentPage"
            @get-list="searchWord"
            @set-page="setPage"
          ></PaginationComponent>
        </v-col>
      </v-row>

      <div class="ms-auto">
        <v-btn v-if="pagePermissions.includes(11)" class="mr-2" flat color="#1976D2"
          ><RouterLink to="/admin/editView">新增字詞</RouterLink></v-btn
        >
        <v-btn v-if="pagePermissions.includes(12)" class="mr-2" flat color="#1976D2"
          ><RouterLink to="/admin/importPage">批次匯入</RouterLink></v-btn
        >
        <!-- <v-btn class="mr-2" :disabled="checkItem.length === 0" flat :color="checkItem.length > 0  ? '#1976D2' : '#F5F5F5'" @click="editWordBatch()">編輯選取詞條</v-btn> -->
        <v-btn
          class="mr-2"
          :disabled="checkItem.length === 0"
          flat
          :color="checkItem.length > 0 ? '#1976D2' : '#F5F5F5'"
          @click="submitReviewView()"
          >移入檢核區</v-btn
        >
        <v-btn
          class="mr-2"
          :disabled="checkItem.length === 0"
          flat
          :color="checkItem.length > 0 ? '#1976D2' : '#F5F5F5'"
          @click="removeReviewView()"
          >移出檢核區</v-btn
        >
        <v-btn
          :disabled="checkItem.length === 0"
          flat
          :color="checkItem.length > 0 ? '#1976D2' : '#F5F5F5'"
          @click="returnToAllDatabaseView()"
          >退回總資料庫區</v-btn
        >
      </div>
    </div>

    <v-table class="mt-4" :height="tableItems.length > 10 ? '550px' : ''" :fixed-header="tableItems.length > 10 ? true : false">
      <thead>
        <tr>
          <th class="text-left">
            <v-checkbox hide-details v-model="checkAllItem" @click.prevent="checkCheckbox"></v-checkbox>
          </th>
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableItems" :key="item">
          <td style="width: 5%">
            <v-checkbox v-model="checkItem" :value="item" hide-details></v-checkbox>
          </td>
          <td>{{ item.wordText }}</td>
          <td>{{ item.pinyin }}</td>
          <td>{{ item.zhuyin }}</td>
          <td style="width: 10%" :class="getStatusClass(item.editStatus)">{{ transferStatus(item.editStatus) }}</td>
          <td style="width: 10%">{{ formatDate(item.createdAt) }}</td>
          <td>{{ item.creator }}</td>
          <td class="text-center" style="width: 400px">
            <a href="#" @click.prevent="previewWord(item)">
              <v-tooltip text="預覽" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-file-eye-outline me-2" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a
              href="#"
              @click.prevent="editWord(item)"
              :class="{ 'link-disabled': item.editStatus.includes(2) || item.editStatus.includes(3) }"
            >
              <v-tooltip text="編輯詞條" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mdi mdi-pencil me-2"
                    x-large
                    :color="item.editStatus.includes(2) || item.editStatus.includes(3) ? '#C0C0C0' : '#000'"
                  ></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a
              href="#"
              @click.prevent="item.editAction !== 0 && returnToAllDatabaseView(item)"
              :class="{ 'link-disabled': item.editAction === 0 }"
            >
              <v-tooltip text="退回總資料庫區" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mdi mdi-keyboard-return me-2"
                    x-large
                    :color="item.editAction !== 0 ? '#000' : '#C0C0C0'"
                  ></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="historyView(item.wordId)">
              <v-tooltip text="查看歷程" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-history me-2" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="deleteView(item, item.editAction)" :class="{ 'link-disabled': item.editAction !== 0 }">
              <v-tooltip text="刪除字詞" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mdi mdi-trash-can-outline"
                    :color="item.editAction === 0 ? '#000' : '#C0C0C0'"
                    x-large
                  ></v-icon>
                </template>
              </v-tooltip>
            </a>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <LoadingComponent :loading="loading" />
  <!-- 歷程檢視 -->
  <v-dialog v-model="historyDialog" max-width="800px" max-height="600px" persistent>
    <HistoryComponent @close-dialog="historyDialog = false" :history-word="historyWord"></HistoryComponent>
  </v-dialog>

  <!-- 刪除字條 -->
  <v-dialog v-model="deleteDialog" max-width="500px" persistent>
    <DeleteComponent @close-dialog="deleteDialog = false" @delete-word="removeWord()"></DeleteComponent>
  </v-dialog>

  <!-- 退回總資料庫 -->
  <v-dialog v-model="returnToAllDatabaseDialog" max-width="500px" persistent>
    <ReturnToAllDatabase @close-dialog="returnToAllDatabaseDialog = false" @return-word="returnToAll()"></ReturnToAllDatabase>
  </v-dialog>

  <!-- 移入檢核區 -->
  <v-dialog v-model="submitReviewDialog" max-width="500px" persistent>
    <submitReviewComponent @close-dialog="submitReviewDialog = false" @submit-review="submitReview()"></submitReviewComponent>
  </v-dialog>

  <!-- 移入檢核區 -->
  <v-dialog v-model="removeReviewDialog" max-width="500px" persistent>
    <removeReviewComponent @close-dialog="removeReviewDialog = false" @submit-review="removeReview()"></removeReviewComponent>
  </v-dialog>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useEditdbStore } from '@/stores/Editdatabase.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PaginationComponent from '@/components/PaginationComponent.vue';
import HistoryComponent from '@/components/database/HistoryComponent.vue';
import DeleteComponent from '@/components/database/editDeleteComponent.vue';
import submitReviewComponent from '@/components/database/submitReviewComponent.vue';
import removeReviewComponent from '@/components/database/removeReviewComponent.vue';
import ReturnToAllDatabase from '@/components/database/ReturnToAllDatabaseComponent.vue';
import editSrv from '@/service/dataEdit.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useRoute } from 'vue-router';
import userPagePermissionSrv from '@/service/userPagePermission.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
  components: {
    VueDatePicker,
    PaginationComponent,
    HistoryComponent,
    DeleteComponent,
    ReturnToAllDatabase,
    submitReviewComponent,
    removeReviewComponent,
    LoadingComponent
  },
  data() {
    return {
      searchCondition: {
        toEditDate: [],
        wordName: '', // 字詞名
        definition: '', // 釋義
        pinyin: '', // 漢語拼音
        zhuyin: '', // 注音
        selectedEditStatus: null, // 編輯狀態
        creator: '', // 建立者
        editor: '', // 修改者
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        page: 1,
        pageSize: 500
      },
      listAmount: [10, 50, 200, 500],
      selectedListAmount: 50,
      checkItem: [],
      checkAllItem: false,
      editDialog: false,
      historyDialog: false,
      deleteDialog: false,
      returnToAllDatabaseDialog: false,
      submitReviewDialog: false,
      removeReviewDialog: false,
      tableItems: [],
      editStatus: [],
      wordIds: [],
      sortBy: '',
      sortOrder: '',
      paginations: {
        currentPage: 1,
        totalCount: 0,
        totalPages: 1
      },
      loading: false,
      historyWord: '',
      singleReturnToAll: '',
      deleteWordId: '',
      headers: [
        {
          title: '字詞名',
          value: 'word_text',
          sort: '',
          width: '15%'
        },
        {
          title: '漢語拼音',
          value: 'pinyin',
          sort: '',
          width: '15%'
        },
        {
          title: '注音',
          value: 'zhuyin',
          sort: '',
          width: '15%'
        },
        {
          title: '編輯狀態',
          value: 'edit_status',
          sort: '',
          width: ''
        },
        {
          title: '送編時間',
          value: 'createdAt',
          sort: '',
          width: ''
        },
        {
          title: '送編人員',
          value: 'creator',
          sort: '',
          width: ''
        }
      ],
      toEditInputOptions: {
        rangeSeparator: ''
      },
      pagePermissions: [],
      allWordIds: []
    };
  },
  created() {
    const store = useEditdbStore();
    const { searchCondition, editViewTableItem, paginations, checkItem, allWordIds } = storeToRefs(store);
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
    if (allWordIds) {
      this.allWordIds = allWordIds;
    }
  },
  watch: {
    searchCondition: {
      handler(newValue) {
        const store = useEditdbStore();
        store.updateSearchCondition(newValue);
      },
      deep: true
    },
    tableItems: {
      handler(newValue) {
        const store = useEditdbStore();
        store.updateEditViewTableItem(newValue);
      },
      deep: true
    },
    paginations: {
      handler(newValue) {
        const store = useEditdbStore();
        store.updatePagination(newValue);
      },
      deep: true
    },
    allWordIds: {
      handler(newValue) {
        const store = useEditdbStore();
        store.updateAllWordIds(newValue);
      },
      deep: true
    },
    'searchCondition.toEditDate': {
      handler(val) {
        if (val && val[1] !== null) {
          this.toEditInputOptions.rangeSeparator = '-';
        } else {
          this.toEditInputOptions.rangeSeparator = '';
        }
      },
      deep: true
    },
    checkItem: {
      handler(newValue) {
        const store = useEditdbStore();
        store.updateChecklistItem(newValue);
      }
    }
  },
  mounted() {
    this.getDataEditDropdown();
    this.getPagePermission();
    localStorage.removeItem('wordTextInfo');
    localStorage.removeItem('editData');
    localStorage.removeItem('isVerify');

    // 路由有帶參數 reset --> 才重置 pinia
    const store = useEditdbStore();
    const route = useRoute();
    if (Object.keys(route.query).length && route.query.action === 'reset') {
      store.$reset();
      this.$router.replace(route.path);
      // this.searchWord(1);
      return;
    }
  },
  methods: {
    transferStatus(value) {
      switch (value) {
        case '0':
          return '尚未修改';
        case '1':
          return '已修改';
        case '2':
          return '已送審';
        case '3':
          return '審核中';
        case '4':
          return '退回修改';
        default:
          return '';
      }
    },
    getStatusClass(value) {
      const statusClasses = {
        0: 'grey',
        1: 'green',
        2: 'blue',
        3: 'blue',
        4: 'red'
      };
      return statusClasses[value] || '';
    },
    checkCheckbox() {
      if (this.checkAllItem === true) {
        this.checkItem = [];
        this.checkAllItem = false;
      } else {
        this.checkItem = this.allWordIds;
        this.checkAllItem = true;
      }
    },
    trueCount() {
      return this.checkItem.filter((item) => item === true).length;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const isUtc = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-');
      if (isUtc) {
        date.setHours(date.getHours() + 8); // Taiwan is UTC+8
      }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}`;
      return formattedDateTime;
    },
    editView() {
      this.editDialog = true;
    },
    deleteView(item, editAction) {
      if (editAction === 0) {
        this.deleteDialog = true;
        this.deleteWordId = item.editWordId;
      }
    },
    historyView(wordId) {
      this.historyWord = wordId;
      this.historyDialog = true;
    },
    returnToAllDatabaseView(id) {
      this.returnToAllDatabaseDialog = true;
      this.singleReturnToAll = id;
    },
    submitReviewView() {
      this.submitReviewDialog = true;
    },
    removeReviewView() {
      this.removeReviewDialog = true;
    },
    searchWord(pageInit) {
      this.loading = true;
      this.checkAllItem = false;
      this.checkItem = [];
      this.tableItems = [];
      const wordName = this.searchCondition.wordName || '';
      const definition = this.searchCondition.definition || '';
      let editStartDate = '';
      let editEndDate = '';

      if (this.searchCondition.toEditDate && this.searchCondition.toEditDate.length > 0) {
        editStartDate = encodeURIComponent(this.transformDate(this.searchCondition.toEditDate[0]) + 'T00:00:00') || '';
        editEndDate = this.searchCondition.toEditDate[1]
          ? encodeURIComponent(this.transformDate(this.searchCondition.toEditDate[1]) + 'T23:59:59')
          : encodeURIComponent(this.transformDate(this.searchCondition.toEditDate[0]) + 'T23:59:59');
      }
      const pinyin = this.searchCondition.pinyin || '';
      const zhuyin = this.searchCondition.zhuyin || '';
      const editStatus = this.searchCondition.selectedEditStatus || '';
      const creator = this.searchCondition.creator || '';
      // 頁數跟數量
      let page = this.paginations.currentPage;
      if (pageInit) {
        page = pageInit;
      }
      const pageSize = this.selectedListAmount;
      // 排序
      const sortBy = this.searchCondition.sortBy || '';
      const sortOrder = this.searchCondition.sortDirection || '';
      this.allWordIds = [];
      editSrv
        .wordsSearch(
          editStartDate,
          editEndDate,
          wordName,
          definition,
          pinyin,
          zhuyin,
          editStatus,
          creator,
          page,
          pageSize,
          sortBy,
          sortOrder
        )
        .then((res) => {
          this.loading = false;

          if (res.data.rtnCode === '0000') {
            this.tableItems = res.data.data;
            this.paginations = res.data.pagination;
            this.allWordIds = this.tableItems;
            // this.tableItems.forEach(i => {
            //     this.allWordIds.push(i.wordId)
            // })
            // for (let item of this.tableItems) {
            //     if (!this.checkItem.some(checkItem => checkItem === item.wordId)) {
            //         this.checkAllItem = false;
            //     }else{
            //         this.checkAllItem = true
            //     }
            // }
          } else {
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
      (this.searchCondition.toEditDate = []),
        (this.searchCondition.wordName = ''),
        (this.searchCondition.definition = ''),
        (this.searchCondition.pinyin = ''),
        (this.searchCondition.zhuyin = ''),
        (this.searchCondition.selectedEditStatus = null),
        (this.searchCondition.creator = ''),
        (this.searchCondition.editor = ''),
        (this.searchCondition.page = 1),
        (this.pageSize = 10),
        (this.sortBy = ''),
        (this.sortOrder = '');
    },
    getDataEditDropdown() {
      editSrv.getDataEditDropdown().then((res) => {
        this.editStatus = res.data;
        this.editStatus.forEach((i) => {
          i.editNumber = i.editNumber.toString();
        });
        const editDefault = {
          editNumber: null,
          editName: 'All',
          editNameZh: '所有編輯狀態'
        };
        this.editStatus.unshift(editDefault);
      });
    },
    // 預覽
    previewWord(obj) {
      const id = obj.editWordId;
      editSrv.previewWord(id).then((res) => {
        const wordData = JSON.stringify(res.data);
        localStorage.setItem('wordTextInfo', wordData);
        localStorage.setItem('path', 'edit');
        this.$router.push(`/admin/WordDetail/${id}`);
      });
    },
    // 編輯
    editWord(obj) {
      if (obj.editStatus === '2' || obj.editStatus === '3') {
        return;
      }
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
      const creator = obj.creator;
      if (user.backendUserAccount !== creator) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: '您不是該字詞的送編者，無法進行編輯',
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      } else {
        const id = {
          editWordIds: []
        };
        if (obj !== null) {
          id.editWordIds.push(obj.editWordId);
          editSrv.editWord(id).then((res) => {
            let resData = null;
            if (!res.isSuccess) {
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.msg.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              }).then((result) => {
                if (result.isConfirmed) {
                  this.searchWord();
                }
              });
            } else {
              resData = res.data;
              const stringData = JSON.stringify(resData);
              localStorage.setItem('editData', stringData);
              this.$router.push('/admin/editView');
            }
          });
        }
      }
    },
    // 批次編輯
    async editWordBatch() {
      const trueIndexes = this.checkItem.reduce((acc, item, index) => {
        if (item === true) {
          acc.push(index);
        }
        return acc;
      }, []);
      const id = {
        editWordIds: []
      };
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
      const wordText = [];
      trueIndexes.forEach((i) => {
        const creator = this.tableItems[i].creator;
        if (user.backendUserAccount !== creator) {
          wordText.push(this.tableItems[i].wordText);
        }
      });
      if (wordText.length > 0) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `您不是 ${wordText} 的送編者，無法進行編輯`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      } else {
        this.checkItem.forEach((item) => {
          const matchItem = this.tableItems.find((tableItem) => tableItem.wordId === item);
          if (matchItem) {
            id.editWordIds.push(matchItem.editWordId);
          } else {
            console.log('No match found');
          }
        });

        editSrv.editWord(id).then((res) => {
          let resData = null;
          if (!res.isSuccess) {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.msg.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                this.searchWord();
              }
            });
          } else {
            resData = res.data;
            const stringData = JSON.stringify(resData);
            localStorage.setItem('editData', stringData);
            this.$router.push('/admin/editView');
          }
        });
      }
    },
    // 退回總資料庫
    returnToAll() {
      this.loading = true;
      const tempTableItems = this.tableItems;
      this.tableItems = [];

      this.returnToAllDatabaseDialog = false;
      const obj = {
        editWordIds: []
      };
      if (this.checkItem.length > 0) {
        this.checkItem.forEach((i) => {
          obj.editWordIds.push(i.editWordId);
        });
      } else {
        obj.editWordIds.push(this.singleReturnToAll.editWordId);
      }

      editSrv.returnToAll(obj).then((res) => {
        this.loading = false;
        if (res.data.rtnCode === '0000') {
          Swal.fire({
            toast: true,
            position: 'center',
            title: `${res.data.rtnMsg}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              this.searchWord();
            }
          });
        } else {
          Swal.fire({
            toast: true,
            position: 'center',
            title: `${res.data.rtnMsg}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 800
          });
          this.returnTable(tempTableItems);
        }
      });
    },
    // 移入檢核區
    submitReview() {
      this.loading = true;
      const tempTableItems = this.tableItems;
      this.tableItems = [];
      const obj = {
        editWordIds: []
      };
      const wordText = [];
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));

      this.checkItem.forEach((i) => {
        if (user.backendUserAccount !== i.creator) {
          wordText.push(i.wordText);
        }
        obj.editWordIds.push(i.editWordId);
      });

      if (wordText.length > 0) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `您不是以下字詞的送編人員，無法移入檢核區 <br> ${wordText} `,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 800
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true;
            this.returnTable(tempTableItems);
          }
        });
      } else {
        editSrv.submitReview(obj).then((res) => {
          this.loading = false;
          if (res.data.rtnCode === '0000') {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                this.searchWord();
              }
            });
          } else {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 800
            });
            this.returnTable(tempTableItems);
          }
        });
      }
    },
    // 移出檢核區
    removeReview() {
      this.loading = true;
      const tempTableItems = this.tableItems;
      this.tableItems = [];
      const obj = {
        editWordIds: []
      };
      const wordText = [];
      const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
      this.checkItem.forEach((i) => {
        if (user.backendUserAccount !== i.creator) {
          wordText.push(i.wordText);
        }
        obj.editWordIds.push(i.editWordId);
      });

      if (wordText.length > 0) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `您不是以下字詞的送編人員，無法移出檢核區 <br> ${wordText} `,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 800
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = false;
            this.returnTable(tempTableItems);
          }
        });
      } else {
        editSrv.removeReview(obj).then((res) => {
          this.loading = false;
          if (res.data.rtnCode === '0000') {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400
            }).then((result) => {
              if (result.isConfirmed) {
                this.searchWord();
              }
            });
          } else {
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 800
            });
            this.returnTable(tempTableItems);
          }
        });
        // this.tableItems.forEach((t, index) => {
        //     this.checkItem[index] = false
        //     this.checkAllItem = false
        // })
      }
    },
    formatTime(value) {
      return value.split('T')[0];
    },
    setPage(page) {
      const store = useEditdbStore();
      this.paginations.currentPage = page;
      store.updateCurrentPage(page);
    },
    transformDate(date) {
      if (date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // 將月份和日期補0
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
      }
      return '';
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
      }
      this.searchWord();
    },
    removeWord() {
      const obj = {
        editWordId: this.deleteWordId
      };
      editSrv.deleteWord(obj).then((res) => {
        if (res.data.rtnCode === '0000') {
          Swal.fire({
            toast: true,
            position: 'center',
            title: `${res.data.rtnMsg}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
          }).then((result) => {
            if (result.isConfirmed) {
              this.deleteDialog = false;
              this.searchWord(1);
            }
          });
        } else {
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
    getPagePermission() {
      const id = 10;
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
    returnTable(item) {
      this.loading = true;
      this.tableItems = item;
      this.loading = false;
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
.v-table {
  table {
    tbody {
      tr {
        td {
          &.grey {
            color: #9e9e9e;
          }
          &.green {
            color: #4caf50;
          }
          &.blue {
            color: #2196f3;
          }
          &.red {
            color: #f61e1e;
          }
        }
      }
    }
  }
}
</style>

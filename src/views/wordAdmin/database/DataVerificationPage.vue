<template>
  <div class="bg-white pa-7">
    <v-form @submit.prevent="searchDBList">
      <v-row>
        <v-col cols="3">
          <VueDatePicker
            v-model="searchCondition.submitDate"
            class="h-100"
            locale="zh"
            :format="format"
            range
            :day-names="['一', '二', '三', '四', '五', '六', '日']"
            placeholder="送審時間"
            @update:model-value="updateSubmitDate"
          ></VueDatePicker>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="searchCondition.wordName" variant="outlined" label="字詞名" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="searchCondition.definition" variant="outlined" label="釋義" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="searchCondition.pinyin" variant="outlined" label="漢語拼音" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="searchCondition.zhuyin" variant="outlined" label="注音" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="searchCondition.creator" variant="outlined" label="建立者" hide-details></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="searchCondition.sourceAction"
            item-text="title"
            item-value="val"
            :items="store.actionList"
            variant="outlined"
            label="來源動作"
            hide-details
            no-data-text="請選擇來源動作"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select label="顯示筆數" :items="listAmount" v-model="selectedListAmount" variant="outlined" hide-details></v-select>
        </v-col>
        <v-col cols="3" class="ms-auto">
          <v-row class="g-1">
            <v-col cols="6">
              <v-btn type="button" color="error" variant="flat" class="w-100" @click.prevent="clearSearchCondition">清除</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn type="submit" color="success" variant="flat" class="w-100">搜尋</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <!-- 列表區 -->
    <div class="mt-7 d-flex align-end justify-space-between">
      <v-row class="align-center" no-gutters>
        <p class="mb-0" v-if="store.reviewdbPagination?.totalCount">共 {{ store.reviewdbPagination?.totalCount }} 筆</p>
        <v-col>
          <PaginationComponent
            :pageLength="store.reviewdbPagination?.totalPages"
            :current-page="reviewdbPage"
            @get-list="getReviewdbList"
            @set-page="setPage"
          ></PaginationComponent>
        </v-col>
      </v-row>

      <div class="ms-auto">
        <v-btn
          type="button"
          variant="flat"
          class="me-3"
          :color="canBeClicked"
          :disabled="canNotBeClicked"
          @click.prevent="transferView('轉審')"
          >審核轉讓</v-btn
        >
        <v-btn
          type="button"
          variant="flat"
          class="me-3"
          :color="canBeClicked"
          :disabled="canNotBeClicked"
          @click.prevent="passView('多筆通過', null)"
          >批次通過</v-btn
        >
        <v-btn type="button" variant="flat" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="multiRejectView"
          >批次退回</v-btn
        >
      </div>
    </div>
    <v-table class="mt-4" :height="reviewdbList.length > 10 ? '550px' : ''" :fixed-header="reviewdbList.length > 10 ? true : false">
      <thead>
        <tr>
          <th class="text-left" width="5%">
            <v-checkbox hide-details @change="selectPageWord" v-model="allChecked"></v-checkbox>
          </th>
          <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
            <a href="#" class="text-decoration-none text-darkprimary d-flex align-center" @click.prevent="sortDBList(header)">
              {{ header.title }}
              <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'asc'"></v-icon>
              <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'desc'"></v-icon>
            </a>
          </th>
          <th width="15%"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="word in reviewdbList" :key="word.reviewTraceId">
          <td>
            <v-checkbox hide-details v-model="selectedList" :value="word"></v-checkbox>
          </td>
          <td>{{ word.wordText }}</td>
          <td>{{ word.pinyin }}</td>
          <td>{{ word.zhuyin }}</td>
          <td :class="editActionStyle(word.sourceAction)">{{ editActionText(word.sourceAction) }}</td>
          <td>{{ word.createdAt && dayjs(word.createdAt).format('YYYY/MM/DD HH:mm') }}</td>
          <td>{{ word.creator }}</td>
          <td>
            <a href="#" @click.prevent="goToView(word)">
              <v-tooltip text="預覽" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-file-eye-outline me-2" color="#000" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="historyView(word.wordId)">
              <v-tooltip text="歷程" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-history me-2" color="#000" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="passView('通過', word)">
              <v-tooltip text="通過" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-check-bold me-2" color="#000" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
            <a href="#" @click.prevent="RejectView(word)">
              <v-tooltip text="退回" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="mdi mdi-close-thick" color="#000" x-large></v-icon>
                </template>
              </v-tooltip>
            </a>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <LoadingComponent :loading="loading" />
  <!-- 通過字條 -->
  <v-dialog v-model="passDialog" max-width="800px" max-height="600px" persistent>
    <PassComponent
      @close-dialog="passDialog = false"
      @get-list="getReviewdbList"
      :page="reviewdbPage"
      :action-type="passTitle"
    ></PassComponent>
  </v-dialog>
  <!-- 歷程檢視-->
  <v-dialog v-model="historyDialog" max-width="800px" max-height="600px" persistent>
    <HistoryComponent @close-dialog="historyDialog = false" :history-word="historyWord"></HistoryComponent>
  </v-dialog>
  <!-- 退回 -->
  <v-dialog v-model="rejectDialog" max-width="500px" persistent>
    <RejectComponent @close-dialog="rejectDialog = false" @get-list="getReviewdbList" :page="reviewdbPage"></RejectComponent>
  </v-dialog>
  <!-- 多筆退回 -->
  <v-dialog v-model="multiRejectDialog" max-width="800px" persistent>
    <MultiRejectComponent @close-dialog="multiRejectDialog = false" @get-list="getReviewdbList" :page="reviewdbPage"></MultiRejectComponent>
  </v-dialog>
  <!-- 審核轉讓 -->
  <v-dialog v-model="transferDialog" max-width="800px" persistent>
    <TransferComponent
      @close-dialog="transferDialog = false"
      @get-list="getReviewdbList"
      :page="reviewdbPage"
      :action-type="transferTitle"
    ></TransferComponent>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useReviewdbStore } from '@/stores/Reviewdatabase.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import PaginationComponent from '@/components/PaginationComponent.vue';
import reviewdatabaseSrv from '@/service/reviewdatabase.js';
import helperUtil from '@/utils/helpers/helper.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

dayjs.extend(utc);
const router = useRouter();
const route = useRoute();

// datepicker
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const date = ref(new Date());
const format = (date) => {
  const startDate = dayjs(date[0]).format('YYYY/MM/DD');
  if (date[1]) {
    const endDate = date[1] ? dayjs(date[1]).format('YYYY/MM/DD') : '';
    return `${startDate} - ${endDate}`;
  } else {
    return `${startDate}`;
  }
};

const store = useReviewdbStore();
const { searchCondition, headers, selectedList, reviewdbList, selectedWord } = storeToRefs(store); // 搜尋條件、標題

const selectedListAmount = ref(50);
const listAmount = ref([10, 50, 200, 500]);
// 搜尋 loading
const loading = ref(false);
// 取得下拉選單
const getSearchList = () => {
  reviewdatabaseSrv.getSearchList().then((res) => {
    if (!res.isSuccess) {
      Swal.fire({
        toast: true,
        position: 'center',
        title: `${res.msg}`,
        confirmButtonColor: '#0E2A34',
        confirmButtonText: '確認',
        background: '#F0F0F2',
        width: 400
      });
      res.return;
    }
    store.setSearchList(res.data);
  });
};

// 取得檢核區列表
const reviewdbPage = ref(1);
const allWordIds = ref([]);
const getReviewdbList = (page = 1, search = '') => {
  reviewdbList.value = [];
  selectedList.value = [];
  loading.value = true;
  reviewdbPage.value = page;
  const pageSize = selectedListAmount.value;
  reviewdatabaseSrv
    .getReviewdbList(page, searchCondition.value, pageSize)
    .then((res) => {
      if (!res.isSuccess) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${res.msg}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
        res.data.pagination.totalPages = 1;
        store.setReviewdbList(res.data.data, res.data.pagination);
        return;
      }
      // 透過搜尋查無結果，顯示視窗
      if (res.data.data && res.data.data.length === 0 && search === 'y') {
        Swal.fire({
          toast: true,
          position: 'center',
          title: '查無資料',
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
      allWordIds.value = [];
      res.data.data.forEach((word) => allWordIds.value.push(word));
      store.setReviewdbList(res.data.data, res.data.pagination);
      store.setAllWordIds(allWordIds.value);
    })
    .finally(() => {
      loading.value = false;
    });
};

// set page
const setPage = (page) => {
  reviewdbPage.value = page;
};

// 清除搜尋條件
const clearSearchCondition = () => {
  store.clearCondition();
  headers.value.forEach((item) => (item.sort = '')); // 清除被選排序的欄位
};

// 來源動作顏色套用
const editActionStyle = (status) => {
  return helperUtil.reviewdbEditActionStyle(status);
};
// 來源動作文字對應
const editActionText = (status) => {
  return helperUtil.reviewdbActionText(status);
};

// 可點批次按鈕
const canBeClicked = computed(() => {
  return !(selectedList && selectedList.value && selectedList.value.length === 0) ? '#1976D2' : '#F5F5F5';
});
//
const canNotBeClicked = computed(() => {
  return selectedList && selectedList.value && selectedList.value.length === 0;
});

// 排序
const sortDBList = (header) => {
  // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
  if (header.value !== searchCondition.value.sortBy) {
    headers.value.forEach((item) => (item.sort = ''));
  }
  // 找出哪個欄位要排序，給予對應的條件值
  const idx = headers.value.findIndex((item) => item.value === header.value);
  if (idx !== -1) {
    headers.value[idx].sort = header.sort ? (header.sort === 'asc' ? 'desc' : 'asc') : 'desc';

    searchCondition.value.sortBy = header.value;
    searchCondition.value.sortDirection = headers.value[idx].sort;
  }

  searchDBList();
};

// 全選
const allChecked = ref(false);
// const selectPageWord = () => {
//     if (allChecked.value) { // 全選(當頁)
//         const wordIds = reviewdbList.value;
//         const all = new Set([...store.selectedList, ...wordIds]);
//         store.selectedList = Array.from(all);
//     } else { // 全不選(當頁)
//         const wordIds = reviewdbList.value;
//         const lastAry = store.selectedList.filter(value => !wordIds.includes(value));
//         store.selectedList = lastAry;
//     }
// };

const selectPageWord = async () => {
  loading.value = true;
  if (allChecked.value) {
    // 全選(當頁)
    selectedList.value = allWordIds.value;
  } else {
    // 全不選(當頁)
    selectedList.value = [];
  }
  loading.value = false;
};

watchEffect(() => {
  if (reviewdbList && reviewdbList.value && reviewdbList.value.length === 0) {
    allChecked.value = false;
    return;
  }
  // const wordIds = reviewdbList.value;
  // allChecked.value = wordIds.every(value => selectedList.value.includes(value));
});

// 送審時間改變
const updateSubmitDate = () => {
  searchCondition.value.submitStartDate =
    searchCondition.value.submitDate && searchCondition.value.submitDate[0]
      ? `${dayjs(searchCondition.value.submitDate[0]).format('YYYY-MM-DD')}T00:00:00Z`
      : '';
  searchCondition.value.submitEndDate =
    searchCondition.value.submitDate && searchCondition.value.submitDate[1]
      ? `${dayjs(searchCondition.value.submitDate[1]).format('YYYY-MM-DD')}T23:59:59Z`
      : '';

  // 如果只有一個日期加上當日結束 23:59:59
  if (searchCondition.value.submitDate && searchCondition.value.submitDate[0] && !searchCondition.value.submitDate[1]) {
    searchCondition.value.submitEndDate = `${dayjs(searchCondition.value.submitDate[0]).format('YYYY-MM-DD')}T23:59:59Z`;
  }
};

// 搜尋
const searchDBList = () => {
  loading.value = true;
  getReviewdbList(1, 'y');
};

// 歷程檢視
import HistoryComponent from '@/components/database/HistoryComponent.vue';
const historyDialog = ref(false);
const historyWord = ref(null);
const historyView = (wordId) => {
  historyDialog.value = true;
  historyWord.value = wordId;
};

// 退回字條
import RejectComponent from '@/components/database/RejectComponent.vue';
const rejectDialog = ref(false);
const RejectView = (reject) => {
  selectedWord.value = [reject];
  rejectDialog.value = true;
};

// 多筆退回字條
import MultiRejectComponent from '@/components/database/MultiRejectComponent.vue';
const multiRejectDialog = ref(false);
const multiRejectView = () => {
  multiRejectDialog.value = true;
};

// 通過字條
import PassComponent from '@/components/database/PassComponent.vue';
const passDialog = ref(false);
const passTitle = ref(null);
const passView = (type, word) => {
  if (type === '通過' && word) {
    // 單筆通過
    selectedWord.value = [word];
  }
  passTitle.value = type;
  passDialog.value = true;
};

// 轉審
import TransferComponent from '@/components/database/TransferComponent.vue';
const transferDialog = ref(false);
const transferTitle = ref(null);
const transferView = (type) => {
  transferTitle.value = type;
  transferDialog.value = true;
};

// 到預覽頁
const goToView = (word) => {
  localStorage.setItem('path', 'review');
  localStorage.setItem('sourceAction', word.sourceAction);
  localStorage.setItem('reviewword', JSON.stringify(word));
  reviewdatabaseSrv
    .lockEditWord(word.editWordId)
    .then((res) => {
      if (!res.isSuccess) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${res.msg}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
        return;
      }
      return reviewdatabaseSrv.getReviewDetail(word.editWordId);
    })
    .then((res) => {
      if (!res.isSuccess) {
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${res.msg}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
        return;
      }
      localStorage.setItem('wordTextInfo', JSON.stringify(res.data));
      router.push(`/admin/wordDetail/${word.reviewTraceId}`);
    });
};

// 取得此頁面按鈕權限
import userPagePermissionSrv from '@/service/userPagePermission.js';
const pagePermissions = ref([]);
const getPagePermission = () => {
  const id = ref(15);
  const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
  const obj = {
    userAccount: user.backendUserAccount
  };
  userPagePermissionSrv.getUserPagePermission(id.value, obj).then((res) => {
    res.data.data.permissions.forEach((i) => {
      pagePermissions.value.push(i.permissionId);
    });
  });
};

onMounted(() => {
  if (localStorage.getItem('reviewword')) {
    getReviewdbList(1);
    localStorage.removeItem('reviewword');
  }
});

// 是否移除 pinia 狀態
// 路由有帶參數 reset --> 才重置 pinia
onMounted(() => {
  if (Object.keys(route.query).length && route.query.action === 'reset') {
    router.replace(route.path);
    store.$reset();
  }
});

onMounted(() => {
  if (store.actionList.length === 0) {
    getSearchList(); // 下拉選單
  }
});

// 取得此頁面按鈕權限
onMounted(() => {
  getPagePermission();
});
</script>

<style lang="scss" scoped>
:deep(.dp__btn.dp__button) {
  // datepicker 時間隱藏
  display: none;
}

:deep(.v-btn--disabled.v-btn--variant-elevated .v-btn__overlay) {
  opacity: 0;
}

:deep(.v-btn--disabled.v-btn--variant-flat .v-btn__overlay) {
  opacity: 0;
}

/* 字詞狀態顏色 */
.word-general {
  color: #4caf50;
}
.word-edit {
  color: #ff9800;
}
.word-unpublish {
  color: #9e9e9e;
}
.word-delete {
  color: #f61e1e;
}
.word-submit {
  color: #2196f3;
}
</style>

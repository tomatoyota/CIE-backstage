<template>
    <div class="bg-white pa-7">
        <v-form @submit.prevent="searchDBList">
            <v-row>
                <v-col cols="3">
                    <VueDatePicker
                        v-model="searchCondition.createDate"
                        class="h-100"
                        locale="zh"
                        :format="format"
                        range
                        :day-names="['一', '二', '三', '四', '五', '六', '日']"
                        placeholder="建立時間"
                        @update:model-value="updateCreateDate"
                    ></VueDatePicker>
                </v-col>
                <v-col cols="3">
                    <VueDatePicker
                        v-model="searchCondition.changeDate"
                        class="h-100"
                        locale="zh"
                        :format="format"
                        range
                        :day-names="['一', '二', '三', '四', '五', '六', '日']"
                        placeholder="異動時間"
                        @update:model-value="updateChangeDate"
                    ></VueDatePicker>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.wordName"
                        variant="outlined"
                        label="字詞名"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.definition"
                        variant="outlined"
                        label="釋義"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.pinyin"
                        variant="outlined"
                        label="漢語拼音"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.zhuyin"
                        variant="outlined"
                        label="注音"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-select
                        v-model="searchCondition.editStatus"
                        item-text="title"
                        item-value="val"
                        :items="store.statusList"
                        variant="outlined"
                        label="字詞狀態"
                        hide-details
                        no-data-text="請選擇字詞狀態"
                    ></v-select>
                </v-col>
                <v-col cols="3">
                    <v-select
                        v-model="searchCondition.shelfStatus"
                        item-text="title"
                        item-value="val"
                        :items="store.toggleList"
                        variant="outlined"
                        label="上下架狀態"
                        hide-details
                        no-data-text="請選擇上下架狀態"
                    ></v-select>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.creator"
                        variant="outlined"
                        label="建立者"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field
                        v-model="searchCondition.editor"
                        variant="outlined"
                        label="修改者"
                        hide-details
                    ></v-text-field>
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
                <p class="mb-0 mr-2" v-if="store.alldbPagination?.totalCount">共 {{ store.alldbPagination?.totalCount }} 筆</p>
                <v-col>
                    <PaginationComponent :pageLength="store.alldbPagination?.totalPages" :current-page="alldbPage" @get-list="getAlldbList" @set-page="setPage"></PaginationComponent>
                </v-col>
            </v-row>
            
            <div class="ms-auto">
                <v-btn v-if="pagePermissions.includes(2)" type="button" variant="flat" class="me-3" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="editView('移入編輯區')">移入編輯區</v-btn>
                <!-- <v-btn type="button" variant="flat" class="me-3" @click.prevent="editView('移出編輯區')">移出編輯區</v-btn> -->
                <v-btn v-if="pagePermissions.includes(4)" type="button" variant="flat" class="me-3" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="exportView">匯出選取詞條</v-btn>
                <v-btn v-if="pagePermissions.includes(5)" type="button" variant="flat" class="me-3" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="publishView('選取詞條上架')">選取詞條上架</v-btn>
                <v-btn v-if="pagePermissions.includes(6)" type="button" variant="flat" class="me-3" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="publishView('選取詞條下架')">選取詞條下架</v-btn>
                <v-btn v-if="pagePermissions.includes(7)" type="button" variant="flat" :color="canBeClicked" :disabled="canNotBeClicked" @click.prevent="deleteView('選取詞條刪除')">選取詞條刪除</v-btn>
            </div>
        </div>
        <v-table class="mt-4" :height="alldbList.length > 10 ? '550px' : ''" :fixed-header="alldbList.length > 10 ? true : false" >
            <thead>
                <tr>
                    <th class="text-left" width="3%">
                        <v-checkbox hide-details @change="selectPageWord" v-model="allChecked"></v-checkbox>
                    </th>
                    <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
                        <a href="#" class="text-decoration-none text-darkprimary d-flex align-center" @click.prevent="sortDBList(header)" v-if="pagePermissions.includes(9) || header.value !== 'publish_toggle'">
                            {{ header.title }}
                            <v-icon icon="mdi mdi-arrow-up" v-if="header.sort === 'asc'"></v-icon>
                            <v-icon icon="mdi mdi-arrow-down" v-if="header.sort === 'desc'"></v-icon>
                        </a>
                        <!-- 上架說明 -->
                        <v-tooltip v-if="header.value === 'publish_toggle' && pagePermissions.includes(9)" text="圓點在右呈深藍色表示上架狀態" location="right">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" class="mdi mdi-help-circle ms-4" x-large></v-icon>
                            </template>
                        </v-tooltip>
                    </th>
                    <th width="15%"></th>
                </tr>
            </thead>
                <tbody>
                    <tr v-for="word in alldbList" :key="word.wordId">
                        <td>
                            <v-checkbox hide-details v-model="selectedList" :value="word.wordId"></v-checkbox>
                        </td>
                        <td>{{ word.wordText }}</td>
                        <td>{{ word.pinyin }}</td>
                        <td>{{ word.zhuyin }}</td>
                        <td :class="editStatusStyle(word.status)">{{ editStatusText(word.status) }}</td>
                        <td>
                            <v-switch
                                v-if="pagePermissions.includes(9)"
                                color="primary"
                                hide-details
                                density="comfortable"
                                v-model="word.publishToggle"
                                @change="publishView(word.publishToggle ? '上架' : '下架', word)"
                            ></v-switch>
                        </td>
                        <td>{{ word.createdAt && dayjs(word.createdAt).format('YYYY/MM/DD HH:mm') }}</td>
                        <td>{{ word.creator }}</td>
                        <td>{{ word.updatedAt && dayjs(word.updatedAt).format('YYYY/MM/DD HH:mm') }}</td>
                        <td>{{ word.editor }}</td>
                        <td>
                            <a href="#" @click.prevent="goToView(word.wordId)">
                                <v-tooltip text="預覽" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-file-eye-outline me-2" color="#000" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                            <a href="#" @click.prevent="editView('編輯', word.wordId)" :class="{ 'link-disabled': word.status !== 0 }" v-if="pagePermissions.includes(3)">
                                <v-tooltip text="移入編輯區" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-pencil me-2" :color="word.status === 0 ? '#000' : '#C0C0C0'" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                            <a href="#" @click.prevent="deleteView('刪除', word.wordId)" :class="{ 'link-disabled': word.status !== 0 }" v-if="pagePermissions.includes(8)">
                                <v-tooltip text="詞條刪除" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-delete-outline me-2" :color="word.status === 0 ? '#000' : '#C0C0C0'" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                            <a href="#" @click.prevent="historyView(word.wordId)">
                                <v-tooltip text="歷程" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-history" color="#000" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                        </td>
                    </tr>
            </tbody>
        </v-table>
        
    </div>
    <LoadingComponent :loading="loading"/>
    <!-- 移至編輯區 -->
    <v-dialog v-model="editDialog" max-width="500px" persistent>
        <EditComponent @close-dialog="editDialog = false" @get-list="getAlldbList" :page="alldbPage" :action-type="editTitle"></EditComponent>
    </v-dialog>
    <!-- 歷程檢視 -->
    <v-dialog v-model="historyDialog" max-width="800px" persistent>
        <HistoryComponent @close-dialog="historyDialog = false" :history-word="historyWord"></HistoryComponent>
    </v-dialog>
    <!-- 匯出選取詞條 -->
    <v-dialog v-model="exportDialog" max-width="800px" persistent>
        <ExportComponent @close-dialog="exportDialog = false" @get-list="getAlldbList" :page="alldbPage"></ExportComponent>
    </v-dialog>
    <!-- 選取詞條上/下架 -->
    <v-dialog v-model="publishDialog" max-width="500px" persistent>
        <PublishToggleComponent @close-dialog="publishDialog = false" @get-list="getAlldbList"  @reset-toggle="resetToggle" :page="alldbPage" :action-type="publishTitle" :toggle-word="toggleWord"></PublishToggleComponent>
    </v-dialog>
    <!-- 刪除字條 -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
        <DeleteComponent @close-dialog="deleteDialog = false" @get-list="getAlldbList" :page="alldbPage" :action-type="deleteTitle"></DeleteComponent>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed, nextTick  } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAlldbStore } from '@/stores/Alldatabase.js';
import { useTabsStore } from '@/stores/Tabs.js';
import dayjs from 'dayjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import PaginationComponent from '@/components/PaginationComponent.vue';
import alldatabaseSrv from '@/service/alldatabase';
import helperUtil from '@/utils/helpers/helper.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
const router = useRouter();
const route = useRoute();

const store = useAlldbStore();
const { searchCondition, headers, selectedList, alldbList, selectedWord, allWordIds } = storeToRefs(store); // 搜尋條件、標題

// datepicker 格式設定
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
const selectedListAmount = ref(50)
const listAmount = ref([10,50,200,500])

// 搜尋 loading
const loading = ref(false);
// 取得下拉選單
const getSearchList = () => {
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
        store.setSearchList(res.data);
    })
}

// 取得總資料庫區列表
const alldbPage = ref(1);
// const allWordIds = ref([])
const getAlldbList = (page = 1) => {
    alldbList.value = []
    selectedList.value = []
    loading.value = true
    alldbPage.value = page;
    const pageSize = selectedListAmount.value
    alldatabaseSrv.getAlldbList(page, searchCondition.value, pageSize).then((res) => {
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
        // 透過搜尋查無結果，顯示視窗
        if (res.data.data && res.data.data.length === 0) {
            Swal.fire({
                toast: true,
                position: 'center',
                title: '查無資料',
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
            })
        };
        allWordIds.value = []
        res.data.data.forEach(word => allWordIds.value.push(word.wordId))
        store.setAlldbList(res.data.data, res.data.pagination);
        store.setAllWordIds(allWordIds.value)
    })
    .finally(() => {
        loading.value = false;
    })
};

// set page
const setPage = (page) => {
    // const wordIds = new Set(alldbList.value.map(word => word.wordId));
    // if (allChecked.value) { // 全選(當頁)
    //     store.selectedList = [...store.selectedList, ...wordIds];
    // } else { // 全不選(當頁)
    //     store.selectedList = store.selectedList.filter(value => !wordIds.has(value));
    // }
    alldbPage.value = page;
}

// 清除搜尋條件
const clearSearchCondition = () => {
    store.clearCondition();
    headers.value.forEach((item) => item.sort = ''); // 清除被選排序的欄位
};

// 字詞狀態顏色套用
const editStatusStyle = (status) => {
    return helperUtil.alldbEditStatusStyle(status);
};
// 字詞狀態文字對應
const editStatusText = (status) => {
    return helperUtil.alldbStatusText(status);
};

// 可點批次按鈕
const canBeClicked = computed(() => {
    return !(selectedList && selectedList.value && selectedList.value.length === 0) ? '#1976D2' : '#F5F5F5';
});
// 
const canNotBeClicked = computed(() => {
    return selectedList && selectedList.value && selectedList.value.length === 0
});

// 建立時間、異動時間改變
const updateCreateDate = () => {
    searchCondition.value.startDate = searchCondition.value.createDate && searchCondition.value.createDate[0] ? `${dayjs(searchCondition.value.createDate[0]).format('YYYY-MM-DD')}T00:00:00Z` : '';
    searchCondition.value.endDate = searchCondition.value.createDate && searchCondition.value.createDate[1] ? `${dayjs(searchCondition.value.createDate[1]).format('YYYY-MM-DD')}T23:59:59Z` : '';

    // 如果只有一個日期加上當日結束 23:59:59
    if (searchCondition.value.createDate && searchCondition.value.createDate[0] && !searchCondition.value.createDate[1]) {
        searchCondition.value.endDate = `${dayjs(searchCondition.value.createDate[0]).format('YYYY-MM-DD')}T23:59:59Z`;
    };
};
const updateChangeDate = () => {
    searchCondition.value.changeStartDate = searchCondition.value.changeDate && searchCondition.value.changeDate[0] ? `${dayjs(searchCondition.value.changeDate[0]).format('YYYY-MM-DD')}T00:00:00Z` : '';
    searchCondition.value.changeEndDate = searchCondition.value.changeDate && searchCondition.value.changeDate[1] ? `${dayjs(searchCondition.value.changeDate[1]).format('YYYY-MM-DD')}T23:59:59Z` : '';

    // 如果只有一個日期加上當日結束 23:59:59
    if (searchCondition.value.changeDate && searchCondition.value.changeDate[0] && !searchCondition.value.changeDate[1]) {
        searchCondition.value.changeEndDate = `${dayjs(searchCondition.value.changeDate[0]).format('YYYY-MM-DD')}T23:59:59Z`;
    };
};

// 搜尋
const searchDBList = () => {
    loading.value = true;
    getAlldbList(1);
};

// 排序
const sortDBList = (header) => {
    loading.value = true
    // 如果不是對同一個欄位排序，先把所有的 sort 清掉，再加上新的 sort
    if (header.value !== searchCondition.value.sortBy) {
        headers.value.forEach((item) => item.sort = '');
    };
    // 找出哪個欄位要排序，給予對應的條件值
    const idx = headers.value.findIndex((item) => item.value === header.value);
    if (idx !== -1) {
        headers.value[idx].sort = header.sort ? (header.sort === 'ASC' ?  'DESC' : 'ASC') : 'DESC';
        
        searchCondition.value.sortBy = header.value;
        searchCondition.value.sortDirection = headers.value[idx].sort;
    };
    alldbList.value = []
    searchDBList();
};

// 全選
const allChecked = ref(false);
const selectPageWord = async () => {
    loading.value = true;
    if (allChecked.value) { 
        // 全選(當頁)
        selectedList.value = allWordIds.value;
    } else { 
        // 全不選(當頁)
        selectedList.value = [];
    }
    await nextTick(); // 等待下一個 DOM 更新循環完成
    loading.value = false;
};

watchEffect(() => {
    if (alldbList && alldbList.value && alldbList.value.length === 0) {
        allChecked.value = false;
        return;
    }
    // const wordIds = alldbList.value.map((word) => word.wordId);
    // allChecked.value = wordIds.every(value => selectedList.value.includes(value));
});

// 移入/移出編輯區
import EditComponent from '@/components/database/EditComponent.vue';
const editDialog = ref(false);
const editTitle = ref(null);
const editView = (type, wordId) => {
    
    if (type === '編輯' && wordId) { // 單筆移入編輯區
        selectedWord.value = [wordId];
    }
    editDialog.value = true;
    editTitle.value = type;
};

// 選取詞條上架/下架
import PublishToggleComponent from '@/components/database/PublishToggleComponent.vue';
const publishDialog = ref(false);
const publishTitle = ref(null);
const toggleWord = ref(null);
const publishView = (type, word) => {
    if (!type.includes('選取詞條') && word) { // 單筆移入編輯區
        selectedWord.value = [word.wordId];
    }
    toggleWord.value = word;
    publishDialog.value = true;
    publishTitle.value = type;
};
// 還原 toggle 狀態
const resetToggle = (word) => {
    word.publishToggle = !word.publishToggle;
}

// 匯出選取詞條
import ExportComponent from '@/components/database/ExportComponent.vue';
const exportDialog = ref(false);
const exportView = (type) => {
    exportDialog.value = true;
};

// 歷程檢視
import HistoryComponent from '@/components/database/HistoryComponent.vue';
const historyDialog = ref(false);
const historyWord = ref(null);
const historyView = (wordId) => {
    historyDialog.value = true;
    historyWord.value = wordId;
}

// 刪除字條
import DeleteComponent from '@/components/database/DeleteComponent.vue';
import { onUnmounted } from 'vue';
const deleteDialog = ref(false);
const deleteTitle = ref(null);
const deleteView = (type, wordId) => {
    if (type === '刪除' && wordId) { // 單筆刪除
        selectedWord.value = [wordId];
    }
    deleteDialog.value = true;
    deleteTitle.value = type;
}

// 到預覽頁
const goToView = (wordId) => {
    localStorage.setItem('path', 'alldb');
    alldatabaseSrv.getWordDetail(wordId).then((res) => {
        if (!res.isSuccess) {
            Swal.fire({
                toast: true,
                position: 'center',
                title: res.msg,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
            });
            return
        };
        localStorage.setItem('wordTextInfo', JSON.stringify(res.data));
        router.push(`/admin/wordDetail/${wordId}`);
    })
};

// 取得此頁面按鈕權限
import userPagePermissionSrv from '@/service/userPagePermission.js';
const pagePermissions = ref([]);
const getPagePermission = () => {
    const id = ref(1);
    const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
    const obj = {
        userAccount: user.backendUserAccount
    };
    userPagePermissionSrv.getUserPagePermission(id.value, obj).then((res) => {
        res.data.data.permissions.forEach(i => {
            pagePermissions.value.push(i.permissionId);
        });
    });
};

// 是否移除 pinia 狀態
// 路由有帶參數 reset --> 才重置 pinia 
onMounted(() => {
    if (Object.keys(route.query).length && route.query.action === 'reset') {
        router.replace(route.path);
        store.$reset();
    }
});

onMounted(() => {
    if (store.statusList && store.statusList.length === 0) {
        getSearchList(); // 下拉選單
    }
});

// 取得此頁面按鈕權限
onMounted(() => {
    getPagePermission()
});
</script>

<style lang="scss" scoped>
:deep(.dp__btn.dp__button) { // datepicker 時間隱藏
    display: none;
}

:deep(.v-btn--disabled.v-btn--variant-elevated .v-btn__overlay) {
    opacity: 0;
}

:deep(.v-btn--disabled.v-btn--variant-flat .v-btn__overlay) {
    opacity: 0;
}

.link-disabled{
    color: #C0C0C0;
    pointer-events: none;
}

/* 字詞狀態顏色 */
.word-general {
    color: #4CAF50;
}
.word-edit {
    color: #FF9800;
}
.word-aduit {
    color: #2196F3;
}
</style>
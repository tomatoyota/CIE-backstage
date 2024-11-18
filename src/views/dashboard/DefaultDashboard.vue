<template>
    <v-container class="py-6">
        <p class="text-h4 mb-4">{{ usename }}，您好</p>
        <p class="mb-4">歡迎登入國教院線上辭典後台</p>
        <p class="mb-6">目前時間是 {{ showCurrentTime }}</p>
        <v-row>
            <v-col lg="6">
                <h3 class="text-subtitle-1">您最近的登入紀錄</h3>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-center">日期</th>
                            <th class="text-center">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="recordItem in loginRecord">
                            <!-- <td class="text-center">{{ modifyTime(recordItem.createdAt) }}</td> -->
                            <!-- <td class="text-center">{{ recordItem.ipAddress }}</td> -->
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
            <v-col lg="6">
                <h3 class="text-subtitle-1">待辦事項</h3>
                <v-table>
                    <tbody>
                        <tr>
                            <td class="text-center">編輯區</td>
                            <!-- <td class="text-center">{{ unsubmittedItems }} 筆</td> -->
                        </tr>
                        <tr>
                            <td class="text-center">審核區</td>
                            <!-- <td class="text-center">{{ pendingReviewItems }} 筆</td> -->
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
    <LoadingComponent :loading="loading"/>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import userHelper from '@/utils/helpers/user.js';
import dayjs from 'dayjs';
import loginSrv from '@/service/login.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

const router = useRouter();
const route = useRoute();

// 使用者名稱
const usename = computed(() => {
    return userHelper.getUsername();
});

// 目前時間
const currentTime = ref(new Date());
const showCurrentTime = ref(dayjs(currentTime.value).format('YYYY 年 MM 月 DD 日 HH 時 mm 分'));
const calculateTime = () => {
    showCurrentTime.value = dayjs(new Date()).format('YYYY 年 MM 月 DD 日 HH 時 mm 分');
}
setInterval(() => calculateTime(), 60000);

onUnmounted(() => {
    clearInterval(calculateTime);
});

// 移除 query 參數
// onMounted(() => {
//     if (Object.keys(route.query).length && route.query.action === 'reset') {
//         router.replace(route.path);
//     }
//     getTodo()
//     getLoginRecord()
// });
const loading = ref(false);
const unsubmittedItems = ref(0);
const pendingReviewItems = ref(0);
// const getTodo = () => {
//     loading.value = true;
//     loginSrv.todo().then((res) => {
//         loading.value = false;
//         if(res.isSuccess){
//             unsubmittedItems.value = res.data.data.unsubmittedItems;
//             pendingReviewItems.value = res.data.data.pendingReviewItems;
//         }
//     })
// };

// const loginRecord = ref([]);
// const getLoginRecord = () => {
//     loading.value = true;
//     loginSrv.loginRecord().then((res) => {
//         loading.value = false;
//         if(res.isSuccess){
//             loginRecord.value = res.data.data;
//         }
//     })
// };

const modifyTime = (dateStr) => {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
}

</script>

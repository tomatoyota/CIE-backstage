<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">歷程</h5>
        </v-card-title>
        <v-card-text class="scroll-y">
            <div v-if="!historyList.length" class="border-history py-5">
                <p class="text-center text-lightText mb-0">無異動歷程</p>
            </div>
            <v-table v-else>
                <thead>
                    <tr>
                        <th class="text-left"></th>
                        <th class="text-left">異動時間</th>
                        <th class="text-left">異動人</th>
                        <th class="text-left">異動類型</th>
                        <th class="text-left">異動內容</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(history, index) in historyList" :key="history">
                        <th class="text-left">{{ index + 1 }}</th>
                        <th class="text-left">{{ history.createdAt && dayjs(history.createdAt).format('YYYY/MM/DD HH:mm') }}</th>
                        <th class="text-left">{{ history.creator }}</th>
                        <th class="text-left">{{ history.action_type && helperUtil.historyActionText(history.action_type) }}</th>
                        <th class="text-left">{{ history.action_content }}</th>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="#1976D2"
                variant="flat"
                @click="closeDelete"
            >
                確認
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import worddataSrv from '@/service/worddata.js';
import helperUtil from '@/utils/helpers/helper.js';

const emit = defineEmits(['close-dialog'])
const closeDelete = () => {
    emit('close-dialog');
};

const props = defineProps({
    historyWord: String
});

// 取得異動歷程
const historyList = ref([]);
const getHistoryList = () => {
    worddataSrv.getHistoryList(props.historyWord).then((res) => {
        if (!res.isSuccess) return
        historyList.value = res.data;
    });
};

watch(() => props.historyWord, (n) => {
    if (n) {
        getHistoryList();
    }
}, { immediate: true })

</script>

<style lang="scss" scoped>
.scroll-y{
    overflow-y: scroll;
}

.border-history {
    border: 1px solid rgba(#8c8c8c, .3);
}
</style>
<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">退回原因</h5>
        </v-card-title>
        <v-card-text>
            <v-table class="mt-4">
                <tbody>
                    <tr v-for="(word, index) in selectedList" :key="word.reviewTraceId">
                        <td>{{ word.wordText }}</td>
                        <td class="pt-4">
                            <v-textarea label="請填寫退回原因" v-model="selectedList[index].reviewedMessage" variant="outlined" :rules="nullRule"></v-textarea>
                        </td>
                        <td v-if="selectedList.length > 1">
                            <a href="#" @click.prevent="copyToAll(word)">
                                <v-tooltip text="套用所有退回原因" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon v-bind="props" class="mdi mdi-content-copy" color="#000" x-large></v-icon>
                                    </template>
                                </v-tooltip>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeReject"
            >
                取消
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold"
                :loading="loading"
                @click="submitReject"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import reviewdatabaseSrv from '@/service/reviewdatabase.js';
import { storeToRefs } from 'pinia';
import { useReviewdbStore } from '@/stores/Reviewdatabase.js';
const store = useReviewdbStore();

const { selectedList } = storeToRefs(store); // 被選取的字詞

const emit = defineEmits(['close-dialog', 'get-list'])
const closeReject = () => {
    emit('close-dialog');
};

// 退回規則
import validateHelper from '@/utils/helpers/validate.js';
const nullRule = ref([
    value => validateHelper.checkNull(value)
])

const props = defineProps({
    page: Number
});

// 套用所有退回原因
const copyToAll = (copyWord) => {
    if (!copyWord.reviewedMessage) return;
    selectedList.value.forEach((word) => {
        word.reviewedMessage = copyWord.reviewedMessage;
    });
};

const loading = ref(false);
// 退回原因
const submitReject = () => {
    loading.value = true;
    reviewdatabaseSrv.rejectReviewWords(selectedList.value).then((res) => {
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
            return
        };
        Swal.fire({
            toast: true,
            icon: 'success',
            position: 'center',
            title: `退回成功`,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            background: '#F0F0F2',
            padding: 25
        });
        emit('get-list', props.page);
        selectedList.value = []; // 清空被勾選的資料
    }).finally(() => {
        loading.value = false;
        emit('close-dialog');
    })
}
</script>
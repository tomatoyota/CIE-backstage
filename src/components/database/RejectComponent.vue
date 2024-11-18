<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">退回原因</h5>
        </v-card-title>
        <v-card-text>
            <v-textarea label="請填寫退回原因" variant="outlined" :rules="nullRule" v-model="reviewedMessage"></v-textarea>
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
                :disabled="disabledSubmit"
                :loading="loading"
                @click="submitReject"
            >
                退回
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import reviewdatabaseSrv from '@/service/reviewdatabase.js';
import { storeToRefs } from 'pinia';
import { useReviewdbStore } from '@/stores/Reviewdatabase.js';
const store = useReviewdbStore();

const { selectedWord } = storeToRefs(store); // 選取字詞

import { useRouter } from 'vue-router';
const router = useRouter();

const emit = defineEmits(['close-dialog', 'get-list']);
const closeReject = () => {
    emit('close-dialog');
};

// 退回規則
import validateHelper from '@/utils/helpers/validate.js';
const nullRule = ref([
    value => validateHelper.checkNull(value)
]);

const disabledSubmit = computed(() => {
    return !reviewedMessage.value
})

const props = defineProps({
    page: Number,
    fromDetail: Boolean
});

const loading = ref(false);
// 退回原因
const reviewedMessage = ref('');
const submitReject = () => {
    loading.value = true;
    selectedWord.value[0].reviewedMessage = reviewedMessage.value;
    reviewdatabaseSrv.rejectReviewWords(selectedWord.value).then((res) => {
        if (!res.isSuccess) {
            Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.msg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
            }).then((result) => {
                if (result.isConfirmed) {
                    emit('close-dialog');
                }
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
        emit('close-dialog');
        selectedWord.value = []; // 清空被勾選的資料
        // 在詳細頁 or 在列表頁
        if (props.fromDetail) {
            router.go(-1);
        } else {
            emit('get-list', props.page);
        }
    }).finally(() => {
        loading.value = false;
    })
}
</script>
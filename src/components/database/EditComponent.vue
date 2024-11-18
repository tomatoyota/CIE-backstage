<template>
    <!-- 編輯、移入/移出編輯區 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">{{ actionTitle }}</h5>
        </v-card-title>
        <v-card-text>
            確認是否{{ actionTitle }}？
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeEdit"
            >
                取消
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold"
                :loading="loading"
                @click="submitWords"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import alldatabaseSrv from '@/service/alldatabase.js';
import { storeToRefs } from 'pinia';
import { useAlldbStore } from '@/stores/Alldatabase.js';
const store = useAlldbStore();

const { selectedList, selectedWord } = storeToRefs(store); // 被選取的字詞

const emit = defineEmits(['close-dialog', 'get-list']);
const closeEdit = () => {
    emit('close-dialog');
};

const props = defineProps({
    page: Number,
    actionType: String
});

const loading = ref(false);
const actionTitle = computed(() => {
    switch (props.actionType) {
        case '移入編輯區':
        case '編輯':
            return '移入編輯區';
        case '移出編輯區':
            return '移出編輯區';
    }
});

const wordsSubmit = () => {
    switch (props.actionType) {
        case '移入編輯區': // 多筆編輯
            return store.selectedList;
        case '編輯': // 單筆編輯
            return store.selectedWord;
    }
}

const submitWords = () => {
    loading.value = true;
    const words = wordsSubmit();
    alldatabaseSrv.editWord(words).then((res) => {
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
            title: `${actionTitle.value}成功`,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            background: '#F0F0F2',
            padding: 25
        });
        emit('get-list', props.page);
        // 清空被勾選的資料
        if (props.actionType === '編輯') {
            selectedWord.value = [];
        } else if (props.actionType === '移入編輯區') {
            selectedList.value = [];
        }
    }).finally(() => {
        loading.value = false;
        emit('close-dialog');
    })
}
</script>
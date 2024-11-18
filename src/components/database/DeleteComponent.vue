<template>
    <!-- 刪除、選取詞條刪除 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">{{ actionTitle }}</h5>
        </v-card-title>
        <v-card-text>
            <!-- 確認是否{{ actionTitle }}？ -->
            <v-textarea label="請填寫刪除原因" variant="outlined" :rules="nullRule" v-model="deleteWordReason" class="mt-4"></v-textarea>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeDelete"
            >
                取消
            </v-btn>
            <v-btn
                color="error"
                variant="flat"
                class="font-weight-bold"
                :loading="loading"
                @click="submitWords"
                :disabled="deleteWordReason === ''"
            >
                刪除
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
const closeDelete = () => {
    emit('close-dialog');
};

const props = defineProps({
    page: Number,
    actionType: String
});

const deleteWordReason = ref('')

const loading = ref(false);
const actionTitle = computed(() => {
    return '選取詞條刪除';
});

import validateHelper from '@/utils/helpers/validate.js';
const nullRule = ref([
    value => validateHelper.checkNull(value)
]);

const wordsSubmit = () => {
    switch (props.actionType) {
        case '選取詞條刪除': // 多筆編輯
            return store.selectedList;
        case '刪除': // 單筆編輯
            return store.selectedWord;
    }
};

const submitWords = () => {
    loading.value = true;
    const words = wordsSubmit();
    const obj = {
        wordIds: words,
        reason: deleteWordReason.value
    }
    alldatabaseSrv.deleteWord(obj).then((res) => {
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
            title: `已送至檢核區進行審核`,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            background: '#F0F0F2',
            padding: 25
        });
        emit('get-list', props.page);
        // 清空被勾選的資料
        if (props.actionType === '刪除') {
            selectedWord.value = {};
        } else if (props.actionType === '選取詞條刪除') {
            selectedList.value = [];
        }
    }).finally(() => {
        emit('close-dialog');
        loading.value = false;
    })    
}

</script>
<template>
    <!-- 選取詞條上架/下架 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">{{ actionTitle }}</h5>
        </v-card-title>
        <v-card-text>
            確認是否{{ actionTitle }}？
            <v-textarea label="請填寫下架原因" variant="outlined" v-if="actionType === '選取詞條下架' || actionType === '下架'" :rules="nullRule" v-model="unpublishWordReason" class="mt-4"></v-textarea>
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
            v-if="actionType === '選取詞條上架' || actionType === '上架'"
            color="#1976D2"
            variant="flat"
            class="font-weight-bold"
            :loading="loading"
            @click="submitWords"
            >
                送出
            </v-btn>
            <v-btn
            v-else    
            color="#1976D2"
            variant="flat"
            class="font-weight-bold"
            :loading="loading"
            :disabled="unpublishWordReason === ''"
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

const emit = defineEmits(['close-dialog', 'get-list', 'resetToggle']);
const closeEdit = () => {
    emit('close-dialog');
    if (props.actionType === '上架' || props.actionType === '下架') {
        emit('resetToggle', props.toggleWord);
    };
};

const props = defineProps({
    page: Number,
    actionType: String,
    toggleWord: Object
});

const loading = ref(false);
const actionTitle = computed(() => {
    switch (props.actionType) {
        case '上架':
        case '選取詞條上架':
            return '選取詞條上架';
        case '下架':
        case '選取詞條下架':
            return '選取詞條下架';
    }
});

import validateHelper from '@/utils/helpers/validate.js';
const nullRule = ref([
    value => validateHelper.checkNull(value)
]);

const wordsSubmit = () => {
    switch (props.actionType) {
        case '選取詞條上架': // 多筆
        case '選取詞條下架':
            return store.selectedList;
        case '上架': // 單筆
        case '下架':
            return store.selectedWord;
    }
}

const unpublishWordReason = ref('')
const submitWords = () => {
    loading.value = true;
    const words = wordsSubmit();
    const reason = unpublishWordReason.value
    let apiSrv = props.actionType === '上架' || props.actionType === '選取詞條上架' ? 'publishWord' : 'unpublishWord';
    alldatabaseSrv[apiSrv](words, reason).then((res) => {
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
            if (props.actionType === '上架' || props.actionType === '下架') {
                emit('resetToggle', props.toggleWord);
            };
            return
        };
        if(props.actionType === '上架' || props.actionType === '選取詞條上架'){
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
        }else{
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
        }
        
        emit('get-list', props.page);
        // 清空被勾選的資料
        if (props.actionType === '上架' || props.actionType === '下架') {
            selectedWord.value = [];
        } else if (props.actionType === '選取詞條上架' || props.actionType === '選取詞條下架') {
            selectedList.value = [];
        }
    }).finally(() => {
        loading.value = false;
        emit('close-dialog');
    })
}
</script>
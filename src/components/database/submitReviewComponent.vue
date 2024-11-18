<template>
    <!-- 刪除、選取詞條刪除 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">移入檢核區</h5>
        </v-card-title>
        <v-card-text>
            確認是否移入檢核區？
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
                color="success"
                variant="flat"
                class="font-weight-bold"
                :loading="loading"
                @click="submitWords"
            >
                確定
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAlldbStore } from '@/stores/Alldatabase.js';
const store = useAlldbStore();
const { selectedList, selectedWord } = storeToRefs(store); // 搜尋條件、標題

const emit = defineEmits(['close-dialog', 'get-list']);
const closeDelete = () => {
    emit('close-dialog');
};

const props = defineProps({
    page: Number,
    actionType: String
});

const loading = ref(false);

const submitWords = () => {
    emit('close-dialog');
    emit('submit-review');
}

</script>
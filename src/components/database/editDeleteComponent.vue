<template>
    <!-- 刪除、選取詞條刪除 -->
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

const emit = defineEmits(['close-dialog', 'delete-word']);
const closeDelete = () => {
    emit('close-dialog');
};

const props = defineProps({
    page: Number,
    actionType: String,
    wordId: String,
});

const loading = ref(false);
const actionTitle = computed(() => {
    return '刪除字詞';
});

const submitWords = () => {
    emit('delete-word'); 
}

</script>
<template>
    <!-- 刪除、選取詞條刪除 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">刪除圖片</h5>
        </v-card-title>
        <v-card-text>
            確認是否刪除圖片？
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
                @click="removeImage"
            >
                確定
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close-dialog', 'removeImage']);
const closeDelete = () => {
    emit('close-dialog');
};

const props = defineProps({
    index: Number
});

const loading = ref(false);

const removeImage = () => {
    const { index } = props;
    emit('close-dialog');
    emit('removeImage', index);
}
</script>

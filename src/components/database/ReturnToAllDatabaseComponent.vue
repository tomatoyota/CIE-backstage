<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">退回總資料庫區</h5>
        </v-card-title>
        <v-card-text>
            是否確定將該字詞退回總資料庫區?
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeReturn"
            >
                取消
            </v-btn>
            <v-btn
                color="error"
                variant="flat"
                class="font-weight-bold"
                @click="returnWord"
            >
                退回
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['close-dialog'])
const closeReturn = () => {
    emit('close-dialog');
};
const returnWord = () => {
    emit('return-word');
};

// const props = defineProps({
//     sport: Object
// });

</script>
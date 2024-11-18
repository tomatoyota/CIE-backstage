<template>
    <!-- 匯出選取詞條 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">匯出選取詞條</h5>
        </v-card-title>
        <v-card-text>
            <v-select label="匯出檔案格式" :items="['xlsx','csv']" item-title="label" item-value="val" v-model="selectedFormat" variant="outlined" :disabled="lockSelect === true" persistent-hint hint="*若非匯出所有欄位，僅能選取 xlsx 格式"></v-select>
            <v-divider class="my-4"></v-divider>
            <label>匯出欄位</label>
            <v-row>
                <v-col cols="2" v-for="(item, index) in colItems">
                    <v-checkbox :label="item.label" v-model="checkItems" :value="item.val" hide-details></v-checkbox>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="ms-auto py-4">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold px-3 py-2"
                size="large"
                @click="closeDialog"
            >
                取消
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold px-3 py-2"
                size="large"
                :loading="editLoading"
                @click="exportWords('editExport')"
            >
                編輯匯出資料
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold px-3 py-2"
                size="large"
                :loading="loading"
                @click="exportWords('exportOnly')"
            >
                僅匯出資料不做編輯
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import alldatabaseSrv from '@/service/alldatabase.js';
import { storeToRefs } from 'pinia';
import { useAlldbStore } from '@/stores/Alldatabase.js';
const store = useAlldbStore();

const { selectedList } = storeToRefs(store); // 被選取的字詞

const emit = defineEmits(['close-dialog', 'get-list']);
const closeDialog = () => {
    emit('close-dialog');
};

const selectedFormat = ref('xlsx')
const colItems = ref([
    { label: '詞類', val: 6 },
    { label: '英譯', val: 7 },
    { label: '釋義', val: 8 },
    { label: '搭配詞', val: 9 },
    { label: '例句', val: 10 },
    { label: '情境分類', val: 11 },
    { label: '詞彙等級', val: 12 },
    { label: '近義詞', val: 13 },
    { label: '反義詞', val: 14 }
])
const checkItems = ref([6, 7, 8, 9, 10, 11, 12, 13, 14])

const lockSelect = ref(false);

const props = defineProps({
    page: Number,
    actionType: String
});

const loading = ref(false);
const editLoading = ref(false);

watchEffect(() => {
    if (checkItems.value.length !== colItems.value.length) {
        selectedFormat.value = 'xlsx';
        lockSelect.value = true;
    }else{
        lockSelect.value = false;
    }
});

const exportWords = (type) => {
    type === 'editExport' ? editLoading.value = true : loading.value = true;
    const obj = {
        exportType: type,
        fileType: selectedFormat.value,
        exportFields: checkItems.value,
        wordIds: selectedList.value
    }
    alldatabaseSrv.exportWords(obj).then((res) => {
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
        const blob = new Blob([res.data.data],  { type: res.data.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `download_匯出選取詞條.${obj.fileType}`);

        document.body.appendChild(link);
        link.click()
        document.body.removeChild(link);
        Swal.fire({
            toast: true,
            icon: 'success',
            position: 'center',
            title: `匯出選取詞條成功`,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            background: '#F0F0F2',
            padding: 25
        });
        emit('get-list', props.page);
        // 清空被勾選的資料
        selectedList.value = [];
    }).finally(() => {
        type === 'editExport' ? editLoading.value = false : loading.value = false;
        emit('close-dialog');
    })
}


</script>
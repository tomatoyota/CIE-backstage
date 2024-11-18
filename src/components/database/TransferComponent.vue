<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">審核轉讓</h5>
        </v-card-title>
        <v-card-text class="scroll-y">
            <v-select :items="auditList" v-model="selectedAuditor" label="請選擇轉審人員" variant="outlined"></v-select>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left"></th>
                        <th class="text-left">字詞名</th>
                        <th class="text-left">來源動作</th>
                        <th class="text-left">送審時間</th>
                        <th class="text-left">建立者</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(word, index) in props.actionType === '轉審' ? selectedList : selectedWord" :key="word">
                        <th class="text-left">{{ index + 1 }}</th>
                        <th class="text-left">{{ word.wordText }}</th>
                        <th class="text-left">{{ word.sourceAction && helperUtil.historyActionText(word.sourceAction) }}</th>
                        <th class="text-left">{{ word.createdAt && dayjs(word.createdAt).format('YYYY/MM/DD HH:mm') }}</th>
                        <th class="text-left">{{ word.creator }}</th>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closePass"
            >
                取消
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold"
                :loading="loading"
                @click="submitTransfer"
            >
                轉審
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import reviewdatabaseSrv from '@/service/reviewdatabase.js';
import helperUtil from '@/utils/helpers/helper.js';
import { storeToRefs } from 'pinia';
import { useReviewdbStore } from '@/stores/Reviewdatabase.js';
const store = useReviewdbStore();

import { useRouter } from 'vue-router';
const router = useRouter();

const { selectedList, selectedWord } = storeToRefs(store); // 被選取的字詞

const props = defineProps({
    page: Number,
    actionType: String,
    fromDetail: Boolean
});

const emit = defineEmits(['close-dialog', 'get-list'])
const closePass = () => {
    emit('close-dialog');
};

onMounted(() => {
    getReviewerList()
})

const selectedAuditor = ref(null);
const auditList = ref([]);
const getReviewerList = () => {
    reviewdatabaseSrv.getReviewerList().then((res) => {
        auditList.value = res.data.auditList;
        const user = JSON.parse(localStorage.getItem('cieebo-admin-user'));
        auditList.value = auditList.value.filter(item => item !== user.backendUserAccount);

    });
}

const wordsSubmit = () => {
    switch (props.actionType) {
        case '轉審': // 多筆通過
            return store.selectedList;
        case '轉審': // 單筆通過
            return store.selectedWord;
    }
}

const loading = ref(false);
const submitTransfer = () => {
    loading.value = true;
    const words = wordsSubmit();
    const auditorList = []
    words.forEach((word) => {
        const matchCreator = auditorList.includes(word.creator)
        if (!matchCreator) {
            auditorList.push(word.creator)
        }
    });
    
    const obj = {
        auditItems: [],
        auditUserAccount: selectedAuditor.value,
    }
    for(let i = 0; i < auditorList.length; i++) {

        const auditItems = {
            creator: auditorList[i],
            infos: []
        }

        words.forEach((word) => {
            if (word.creator === auditorList[i]) {
                const idItem = {
                    wordId: word.wordId,
                    editWordId: word.editWordId,
                    wordText: word.wordText
                }
                auditItems.infos.push(idItem)
            }
        });

        obj.auditItems.push(auditItems)
    }
    reviewdatabaseSrv.transferAudit(obj).then((res) => {
        loading.value = false;
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
            position: 'center',
            title: `${res.msg}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
        });
        // 清空被勾選的資料
        if (props.actionType === '通過') {
            selectedWord.value = [];
        } else if (props.actionType === '多筆通過') {
            selectedList.value = [];
        }
        // 在詳細頁 or 在列表頁
        if (props.fromDetail) {
            router.go(-1);
        } else {
            emit('get-list', props.page);
        }
    }).finally(() => {
        loading.value = false;
        emit('close-dialog');
    })
};
</script>

<style lang="scss" scoped>
.scroll-y{
    overflow-y: scroll;
}
</style>
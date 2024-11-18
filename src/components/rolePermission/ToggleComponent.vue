<template>
    <!-- 選取詞條上架/下架 -->
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
                @click="patchRoleStatus"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import roleSrv from '@/service/rolePermission.js';
import { storeToRefs } from 'pinia';
import { userRoleStore } from '@/stores/rolePermission.js';
const store = userRoleStore();

const { searchCondition } = storeToRefs(store);

const emit = defineEmits(['close-dialog', 'get-list', 'resetToggle']);
const closeEdit = () => {
    emit('close-dialog');
};

const props = defineProps({
    page: Number,
    actionType: String,
    roleId: Number,
});

const loading = ref(false);
const actionTitle = computed(() => {
    switch (props.actionType) {
        case '啟用':
            return '啟用角色';
        case '禁用':
            return '禁用角色';
    }
});

// 這邊需要再改
const patchRoleStatus = () => {
    const id = props.roleId
    roleSrv.patchRoleStatus(id).then((res) => {
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
    }).finally(() => {
        loading.value = false;
        emit('close-dialog');
    })
}

</script>
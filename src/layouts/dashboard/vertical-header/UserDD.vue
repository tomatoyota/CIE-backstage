<template>
    <div class="d-flex text-right ms-auto me-4 mt-4">
        <p class="userInfo me-3">使用者名稱 : {{ username }}</p>
        <p class="userInfo">最後一次登入時間 : {{ userLastTimeLogin }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import userHelper from '@/utils/helpers/user.js';
import dayjs from 'dayjs';
// 使用者名稱
const username = computed(() => {
    return userHelper.getUsername();
});

// 使用者最後一次登入時間
const userLastTimeLogin = computed(() => {
    return userHelper.getUserLastTimeLogin() && dayjs(userHelper.getUserLastTimeLogin()).format('YYYY/MM/DD HH:mm:ss')
});
</script>

<style scoped>
.userInfo{
    color: #676767;
    font-size: 12px;
}
</style>
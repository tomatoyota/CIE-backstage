<template>
  <div class="logo text-center">
    <RouterLink to="/admin/dashboard" class="text-decoration-none" aria-label="logo" @click="checkTab">
      <!-- <img src="../../../assets/images/logo.svg" alt=""> -->
       <h1 class="text-primary"><strong>中國電機工程學會</strong></h1>
    </RouterLink>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTabsStore } from '@/stores/Tabs.js';
const tabsStore = useTabsStore();

const { tabsList } = storeToRefs(tabsStore);

// 加入首頁到頁籤列表內
const checkTab = () => {
  const idx = tabsList.value.findIndex((tab) => tab.title === '首頁');
  if (idx === -1) {
    tabsList.value.push({
        title: '首頁',
        name: 'Dashboard',
        to: '/admin/dashboard'
    });
  }
}


</script>

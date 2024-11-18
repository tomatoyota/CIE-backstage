<template>
    <v-card>
        <v-tabs
            v-model="currentTab"
            class="navTab"
            color="deep-purple-accent-4"
        >
            <v-tab v-for="(tab, index) in tabs" :key="tab" :to="tab.to" :value="tab.title">
                {{ tab.title }}
                <v-btn v-if="currentTab === tab.title" class="bg-white ms-2" variant="plain" @click.stop.prevent="closeTab(tab, index)" icon="mdi-close" size="x-small"></v-btn>
            </v-tab>
        </v-tabs>
        <div v-if="tabs.length > 0">
            <RouterView />
        </div>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useTabsStore } from '@/stores/Tabs.js';

const router = useRouter();
const tabsStore = useTabsStore();

const currentTab = ref(null); // 目前開啟的分頁
const tabs = ref(tabsStore.tabsList); // 列表

// 關閉分頁
const closeTab = (tab, index) => {
    if (index === tabs.value.length - 1 && index > 0) { // 關閉最後一個分頁，開前一頁
        currentTab.value = tabs.value[index - 1].title;
        router.replace(`${tabs.value[index - 1].to}`);
        tabsStore.removeTab(tab);
    } else if (index < tabs.value.length - 1) { // 自動開下一頁
        currentTab.value = tabs.value[index].title;
        router.replace(`${tabs.value[index + 1].to}`);
        tabsStore.removeTab(tab);
    } else if (index === 0 && tabs.value.length === 1) { // 關閉所有分頁，顯示空白
        currentTab.value = '';
        tabsStore.removeTab(tab);
    };
};
</script>
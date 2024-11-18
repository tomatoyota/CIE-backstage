import { defineStore } from 'pinia';

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabsList: []
    }),
    actions: {
        setTabsList (tab) {
            // 檢查是否有存在在 tabsList 內
            const tabIdx = this.tabsList.findIndex((item) => item.title === tab.title);
            if (tabIdx === -1) {
                this.tabsList.push(tab);
            }
        },
        removeTab (close) {
            // 檢查是否有存在在 tabsList 內
            const tabIdx = this.tabsList.findIndex((item) => item.title === close.title);
            if (tabIdx !== -1) {
                this.tabsList.splice(tabIdx, 1);
            }
        },
        clearTabsList () {
            this.tabsList = [];
        }
    }
});
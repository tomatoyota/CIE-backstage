import { defineStore } from 'pinia';

export const useSelectedItemsStore = defineStore('selectedItems', {
  state: () => ({
    // selectedItems: [],
    selectedTab: 1,
  }),
  actions: {
    // setSelectedItems(items) {
    //   this.selectedItems = items;
    // },
    setSelectedTab(tab) {
      this.selectedTab = tab;
    },
    // clearSelectedItems() {
    //   this.selectedItems = [];
    // },
  }
});
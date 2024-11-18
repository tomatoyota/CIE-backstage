import { defineStore } from 'pinia';

export const useTestStore = defineStore('test', {
    state: () => ({
      test: '',
      test2: ''
    }),
    actions: {}
  });
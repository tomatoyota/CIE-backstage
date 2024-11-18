import { defineStore } from 'pinia';

export const usePrintStore = defineStore('printdb', {
    state: () => ({
        printData: [],
        
        
    }),
    actions: {
        updatePrintData(printData) {
            this.printData = printData;
        },
    },
    
});

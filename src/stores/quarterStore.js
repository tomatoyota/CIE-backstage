import { defineStore } from 'pinia';

export const useQuarterStore = defineStore('quarterdb', {
    state: () => ({
        paginations: {
            currentPage: 1,
            totalCount: 0,
            totalPages: 1,
        },
        editData: null,
    }),
    actions: {
        updatePagination(paginations) {
            this.paginations = paginations;
        },
        updateEditData(editData){
            this.editData = editData
        },
    }
});

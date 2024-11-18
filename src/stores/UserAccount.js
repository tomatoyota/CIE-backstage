import { defineStore } from 'pinia';

export const userAccountStore = defineStore('accountdb', {
    state: () => ({
        searchCondition:{
            toEditDate: [],
            wordName: '',
            definition: '',
            pinyin: '',
            zhuyin: '',
            selectedEditStatus: null,
            creator: '',
            editor: '',
            sortBy: '',
            sortDirection: '',
            page: 1,
            pageSize: 10,
        },
        editViewData:{},
        editViewTableItem:[],
        paginations: {
            page: 1,
            totalCount: 0,
            totalPages: 1,
        },
        editStatus:[]
    }),
    actions: {
        updateSearchCondition(newCondition) {
            this.searchCondition = newCondition;
        },
        updateEditViewTableItem(editViewTableItem) {
            this.editViewTableItem = editViewTableItem;
        },
        updatePagination(paginations) {
            this.paginations = paginations;
        },
        updateCurrentPage(page){
            this.paginations.currentPage = page
        }
        // updateEditStatus(editStatus){
        //     this.editStatus = editStatus
        // }
    }
});

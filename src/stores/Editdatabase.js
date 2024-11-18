import { defineStore } from 'pinia';

export const useEditdbStore = defineStore('editdb', {
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
            sortBy: 'createdAt',
            sortDirection: 'DESC',
            page: 1,
            pageSize: 500,
        },
        editViewData:{},
        editViewTableItem:[],
        paginations: {
            currentPage: 1,
            totalCount: 0,
            totalPages: 1,
        },
        editStatus:[],
        checkItem:[],
        allWordIds:[],
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
        updateEditStatus(editStatus){
            this.editStatus = editStatus
        },
        updateCurrentPage(currentPage){
            this.paginations.currentPage = currentPage
        },
        updateChecklistItem(checkItem){
            this.checkItem = checkItem
        },
        updateAllWordIds(allWordIds){
            this.allWordIds = allWordIds
        }
    }
});

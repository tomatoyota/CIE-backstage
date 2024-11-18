import { defineStore } from 'pinia';

export const userRoleStore = defineStore('roledb', {
    state: () => ({
        searchCondition:{
            selectedRole: [], 
            createDate: [],
            updateDate: [],
            creator: '',
            editor: '',
            sortBy: 'role_name',
            sortDirection: 'ASC',
            selectedStatus: null,
            page: 1,
            pageSize: 10,
        },
        editViewData:{},
        editViewTableItem:[],
        paginations: {
            currentPage: null,
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

import { defineStore } from 'pinia';

export const usePersonalStore = defineStore('personaldb', {
    state: () => ({
        searchCondition: {
            frontUserId: '',
            name: '',
            level: null,
            paymentStatus: null,
            sortField: 'createdAt',
            sortOrder: 'DESC',
            page: 1,
            size: 10,
          },
          tableItems: [],
       
        paginations: {
            currentPage: 1,
            totalCount: 0,
            totalPages: 1,
        },
        editData: null,
        paymentData: null,
        userData: null
        
    }),
    actions: {
        updatePagination(paginations) {
            this.paginations = paginations;
        },
        updateEditData(editData){
            this.editData = editData
        },
        updatePaymentData(paymentData){
            this.paymentData = paymentData
        },
        updateUserData(userData){
            this.userData = userData
        },
        setSearchCondition(condition) {
            this.searchCondition = condition;
            console.log('setSearchCondition', this.searchCondition);
          },
          setTableItems(items) {
            this.tableItems = items;
            console.log('setTableItems', this.tableItems);
          },
          setPaginations(pagination) {
            this.paginations = pagination;
            console.log('setPaginations', this.paginations);
          },
          clearStore() {
            this.searchCondition = {
              frontUserId: '',
              name: '',
              level: null,
              paymentStatus: null,
              pageSize: 10,
              sortBy: 'createdAt',
              sortDirection: 'DESC',
            };
            this.paginations = {
              currentPage: 1,
              totalPages: 1,
            };
            this.tableItems = [];
          },
    }
});

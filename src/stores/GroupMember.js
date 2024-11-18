import { defineStore } from 'pinia';

export const useGroupStore = defineStore('groupdb', {
    state: () => ({
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
        }
    }
});

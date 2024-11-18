import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    async postMember (obj) {
        try{
            const method = 'POST';
            const url = '/members/personal';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async searchMemberList (frontUserId, name, level, paymentStatus,page, size, sortField, sortOrder) {
        try{
            const method = 'GET';
            const url = `/members/personal?frontUserId=${frontUserId}&name=${name}&level=${level}&paymentStatus=${paymentStatus}&page=${page}&size=${size}&sortField=${sortField}&sortOrder=${sortOrder}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getAcademicsDetail (id) {
        try{
            const method = 'GET';
            const url = `/members/personal/${id}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async putMember (obj, id) {
        try{
            const method = 'PUT';
            const url = `/members/personal/${id}`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async deleteMember (id) {
        try{
            const method = 'DELETE';
            const url = `/members/personal/${id}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getPaymentHistory (id) {
        try{
            const method = 'GET';
            const url = `/members/personal/payments/${id}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    
}
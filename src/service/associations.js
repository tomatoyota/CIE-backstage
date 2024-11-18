import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    // 搜尋最新消息
    async searchAssociationList (obj) {
        try{
            const method = 'POST';
            const url = '/associations/list';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async postAssociation (obj) {
        try{
            const method = 'POST';
            const url = '/associations/create';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async uploadFile (obj, type) {
        try{
            const method = 'POST';
            const url = `/publication/upload/${type}`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getAssociationDetail (id) {
        try{
            const method = 'GET';
            const url = `/associations/${id}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async deleteAssociationsItem (obj) {
        try{
            const method = 'DELETE';
            const url = `/associations/del`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async associationKeywordSearch (obj) {
        try{
            const method = 'POST';
            const url = `/publication/search`;
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
}
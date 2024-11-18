import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    async getExcel (obj) {
        try{
            const method = 'POST';
            const url = '/members/export';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async dynamicSearch(keyword){
        try{
            const method = 'GET';
            const url = `/members?keyword=${keyword}`;
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async printSticker (obj) {
        try{
            const method = 'POST';
            const url = '/members/export/labels';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
}
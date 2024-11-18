import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    // 搜尋最新消息
    async getPaymentList (obj) {
        try{
            const method = 'POST';
            const url = '/members/annual-fee';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
}
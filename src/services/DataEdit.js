import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    async wordsSearch(obj) {
        try {
            const res = await axiosInstance.post(`/edit/words/search`, obj);
            if (res === null || res.data === null) {
                return null
            }
            return {
                isSuccess: true,
                data: res.data.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    async getDropdown() {
        try {
            const res = await axiosInstance.get('/editScreen/editStatus');
            if (res === null || res.data === null) {
                return null
            }
            return {
                isSuccess: true,
                data: res.data.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    async ReturnToAllDatabase(obj){
        try {
            const res = await axiosInstance.post('/edit/words/return', obj);
            if (res === null || res.data === null) {
                return null
            }
            return {
                isSuccess: true,
                data: res.data.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    }
}
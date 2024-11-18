import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    async searchBatchEdit(param) {
        try {
            const res = await axiosInstance.post(`/batchUpdate/words/search?${param}`);
            if (res === null || res.data === null) {
                return null;
            }
            return {
                isSuccess: true,
                data: res.data
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: error.response.data
            };
        }
    },    
}
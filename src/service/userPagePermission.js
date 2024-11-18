import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    // 取得使用者頁面可使用功能
    async getUserPagePermission(id, obj) {
        try {
            const res = await axiosInstance.post(`/backend-users/permission/page/${id}`, obj);
            if (res === null || res.data === null) {
                return null
            }
            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
}
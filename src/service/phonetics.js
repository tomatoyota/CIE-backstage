import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    // 取得使用者頁面可使用功能
    async searchPhonetics(zhuyin, pinyin, page, pageSize, sortBy, sortDirection) {
        try {
            const res = await axiosInstance.get(`/phonetics/search?zhuyin=${zhuyin}&pinyin=${pinyin}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
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
    async importExcel(formData) {
        try {
            const res = await axiosInstance.post(`/phonetics/import`, formData);
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
                msg: error.response
            }
        }
    },
    async exportExcel(fileType, pinyin) {
        try {
            const res = await axiosInstance.get(`/phonetics/export?fileType=${fileType}&pinyin=${pinyin}`,{
                responseType: 'blob',
                headers: {
                    'Accept': fileType === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv'
                }});
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
                msg: error.response
            }
        }
    },
    async postPhonetics(obj) {
        try {
            const res = await axiosInstance.post(`/phonetics/add`, obj);
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
    async putPhonetics(id, obj) {
        try {
            const res = await axiosInstance.put(`/phonetics/${id}`, obj);
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
import { axiosInstance } from '../utils/helpers/fetch-wrapper';

export default {
    // 跳過新增圖檔直接上傳
    async searchIP(ip,name, userAccount, whitelistId, createdAtStart, createdAtEnd, updatedAtStart, updatedAtEnd, page, pageSize, sortBy, sortDirection) {
        try {
            const res = await axiosInstance.get(`/ip-whitelists?ip=${ip}&name=${name}&userAccount=${userAccount}&whitelistId=${whitelistId}&createdAtStart=${createdAtStart}&createdAtEnd=${createdAtEnd}&updatedAtStart=${updatedAtStart}&updatedAtEnd=${updatedAtEnd}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`) 

            if (res === null || res.data === null) {
                return null
            };

            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg,
                // errorData: error.response.data.data.errorWordsData,
            }
        }
    },
    async getIP(whitelistId) {
        try {
            const res = await axiosInstance.get(`/ip-whitelists?whitelistId=${whitelistId}`) 

            if (res === null || res.data === null) {
                return null
            };

            return {
                isSuccess: true,
                data: res.data.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg,
                errorData: error.response.data.data.errorWordsData,
            }
        }
    },
    async postIP(obj) {
        try {
            const res = await axiosInstance.post(`/ip-whitelists`, obj) 

            if (res === null || res.data === null) {
                return null
            };

            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg,
                // errorData: error.response,
            }
        }
    },
    async putIP(id, obj) {
        try {
            const res = await axiosInstance.put(`/ip-whitelists/${id}`, obj) 

            if (res === null || res.data === null) {
                return null
            };

            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg,
                // errorData: error.response.data.data.errorWordsData,
            }
        }
    },
    async deleteIP(id) {
        try {
            const res = await axiosInstance.delete(`/ip-whitelists/${id}`) 

            if (res === null || res.data === null) {
                return null
            };

            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg,
                errorData: error.response.data.data.errorWordsData,
            }
        }
    },
}
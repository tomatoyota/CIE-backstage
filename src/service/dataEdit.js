import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    async wordsSearch(editStartDate, editEndDate, wordName, definition, pinyin, zhuyin, editStatus, creator, page, pageSize, sortBy, sortDirection) {
        try {
            const res = await axiosInstance.post(`/edit/words/search?editStartDate=${editStartDate}&editEndDate=${editEndDate}&wordName=${wordName}&definition=${definition}&pinyin=${pinyin}&zhuyin=${zhuyin}&editStatus=${editStatus}&creator=${creator}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
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
    async getDataEditDropdown() {
        try {
            const res = await axiosInstance.get('/edit/editStatus');
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
    async getEditViewDropdown() {
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
    // 退回/退回總資料庫區
    async returnToAll(obj){
        try {
            const res = await axiosInstance.post('/edit/words/return', obj);
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
    // 送審/移入檢核區
    async submitReview(obj){
        try {
            const res = await axiosInstance.post('/edit/words/submitReview', obj);
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
    // 移出檢核區
    async removeReview(obj){
        try {
            const res = await axiosInstance.post('/edit/words/removeReview', obj);
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
                data: error.response.data
            }
        }
    },
    async editWord(id) {
        try {
            const res = await axiosInstance.post(`/edit/words/editVocab`, id);
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
                msg: error.response.data
            }
        }
    },
    async previewWord(id) {
        try {
            const res = await axiosInstance.get(`/edit/words/preview/${id}`);
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
    async removeFromReview(){
        try {
            const res = await axiosInstance.get(`/edit/words/preview/${id}`);
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
    async uploadFile(obj){
        try {
            const res = await axiosInstance.post(`/editScreen/words/uploadMedia`, obj);
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
    async addWord(obj){
        try {
            const res = await axiosInstance.post(`/edit/words/add`, obj);
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
    async saveEdit(obj){
        try {
            const res = await axiosInstance.post(`/editScreen/words/save`, obj);
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
    async saveAndSubmit(obj){
        try {
            const res = await axiosInstance.post(`/editScreen/words/saveSubmit`, obj);
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
    async deleteWord(obj) {
        try {
            const res = await axiosInstance.delete(`/edit/words/delete`, { data: obj });
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
                msg: error.response.data.rtnMsg
            };
        }
    }
}
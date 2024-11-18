import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    // 取得使用者頁面可使用功能
    async getUserRelations(auditGroupName, auditUserAccount, wordManagerUserAccounts, createdAtStart, createdAtEnd, updatedAtStart, updatedAtEnd, creator, editor, page, pageSize, sortBy, sortDirection) {
        try {
            const res = await axiosInstance.get(`/user-management/audit-mappings?auditGroupName=${auditGroupName}&auditUserAccount=${auditUserAccount}&wordManagerUserAccounts=${wordManagerUserAccounts}&createdAtStart=${createdAtStart}&createdAtEnd=${createdAtEnd}&updatedAtStart=${updatedAtStart}&updatedAtEnd=${updatedAtEnd}&creator=${creator}&editor=${editor}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
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
    },   
    async getEditUserRelations(id) {
        try {
            const res = await axiosInstance.get(`/user-management/audit-mappings/${id}`);
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
    },
    async addUserRelations(obj) {
        try {
            const res = await axiosInstance.post(`/user-management/audit-mappings/`, obj);
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
    },
    async putUserRelations(obj) {
        try {
            const res = await axiosInstance.put(`/user-management/audit-mappings/`, obj);
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
    },
    async getUserAccountList() {
        try {
            const res = await axiosInstance.get(`/backend-users/dropdown/`);
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
    },
}
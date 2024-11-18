import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    
    // 建立新的使用者
    async pagesButton() {
        try {
            const res = await axiosInstance.get('/roles/pages-buttons');
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
    async getRoleList(){
        try{
            const res = await axiosInstance.get(`/roles/active`)
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
    async addRole(obj){
        try{
            const res = await axiosInstance.post('/roles', obj)
            if (res === null || res.data === null) {
                return null
            }
            return {
                isSuccess: true,
                data: res.data
            }
        } catch (error){

        }return {
            isSuccess: false,
            msg: error.response.data.rtnMsg
        }
    },
    async searchRole(roleName, createdAtStart, createdAtEnd, updatedAtStart, updatedAtEnd, creator, editor, status, page, pageSize, sortBy, sortOrder){
        try{
            const res = await axiosInstance.get(`/roles?roleName=${roleName}&createdAtStart=${createdAtStart}&createdAtEnd=${createdAtEnd}&creator=${creator}&updatedAtStart=${updatedAtStart}&updatedAtEnd=${updatedAtEnd}&editor=${editor}&status=${status}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortOrder}`)
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
    async patchRoleStatus(id){
        try{
            const res = await axiosInstance.patch(`/roles/roles/${id}/status`)
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
    async checkRoleUsers(id){
        try{
            const res = await axiosInstance.get(`/roles/${id}/users`)
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
    async getEditRole(id){
        try{
            const res = await axiosInstance.get(`/roles/${id}/permissions`)
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
    async editRole(id, obj){
        try{
            const res = await axiosInstance.put(`/roles/roles/${id}`, obj)
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
    }
    
}
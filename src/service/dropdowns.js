import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    
    async getLocationList (obj) {
        try{
            const method = 'GET';
            const url = '/location';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getPersonalLevelList (obj) {
        try{
            const method = 'GET';
            const url = '/level/personal';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getGroupLevelList (obj) {
        try{
            const method = 'GET';
            const url = '/level/group';
            const data = obj;
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getBranchList () {
        try{
            const method = 'GET';
            const url = '/branch';
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
    async getAcademicsVolume () {
        try{
            const method = 'GET';
            const url = '/academics/dropdown/volume';
            const data = '';
            const res = await callApi(method, url, data);
            
            return res

        }catch(error){
            return error
        }
    },
}
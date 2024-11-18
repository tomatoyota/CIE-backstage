import { axiosInstance, callApi } from '../utils/helpers/fetch-wrapper';

export default {
    // 搜尋最新消息
    async searchAnnouncement (obj) {
        try{
            const method = 'POST';
            const url = '/announcements/search';
            const data = obj;
            const res = await callApi(method, url, data);

            return res

        }catch(error){
            return error
        }
    },
    async postAnnouncement (obj) {
        try {
            const method = 'POST';
            const url = '/announcements';
            const data = obj;
            const res = await callApi(method, url, data);
    
            return res;
            
        } catch (error) {
            return error;
        }
    },
    async deleteAnnouncement(id) {
        try {
            const method = 'DELETE';
            const url = `/announcements/del`;
            const payload = { announcementsId: id };
            const res = await callApi(method, url, payload);
            
            if (!res || !res.data) {
                return {
                    isSuccess: false,
                    msg: 'API 回應為 null，刪除失敗'
                };
            }
    
            return {
                isSuccess: true,
                data: res.data
            };
        } catch (error) {
            const errMsg = error.response?.data?.rtnMsg || '刪除失敗';
            return {
                isSuccess: false,
                msg: errMsg,
            };
        }
    },
    async putAnnouncement (obj) {
        try {
            const method = 'PUT';
            const url = '/announcements';
            const data = obj;
            const res = await callApi(method, url, data);
    
            return res;
            
        } catch (error) {
            return error;
        }
    },
    // async putAnnouncement (obj) {
    //     try {
    //         const res = await axiosInstance.put(`/announcements`, obj);

    //         if (res === null || res.data === null) {
    //             return null
    //         }

    //         return {
    //             isSuccess: true,
    //             data: res.data
    //         }
    //     } catch (error) {
    //         return {
    //             isSuccess: false,
    //             msg: error.response.data.rtnMsg
    //         }
    //     }
    // },
    async getAnnouncement (id) {
        try {
            const res = await axiosInstance.get(`/announcements/${id}`);

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
    async uploadMedia (obj) {
        try {
            const res = await axiosInstance.post(`/announcements/uploadMedia`, obj);

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
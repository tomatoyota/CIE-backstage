import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    async searchImage(wordText, page, pageSize) {
        try {
            const res = await axiosInstance.get(`/edit/images/search?wordText=${wordText}&page=${page}&pageSize=${pageSize}`);
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
    async uploadExcel(obj) {
        try {
            const res = await axiosInstance.post(`/edit/images/upload-csv`, obj);
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
    async batchUploadImage(formData) {
        try {
            const res = await axiosInstance.post(`/edit/images/upload`, formData);
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
    async batchImageExport(imageIds) {
        try {
            const res = await axiosInstance.post(`/edit/images/export`, imageIds,{
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/zip'
                }
            })
            if (res === null || res.data === null) {
                return null;
            }
            return {
                isSuccess: true,
                data: res
            };
        } catch (error) {
            return {
                isSuccess: false,
                data: error.response.data
            };
        }
    },
}
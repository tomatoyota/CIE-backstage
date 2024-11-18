import { axiosInstance } from '../utils/helpers/fetch-wrapper.js';

export default {
    async searchAudio(wordText, page, pageSize) {
        try {
            const res = await axiosInstance.get(`/edit/audios/search?wordText=${wordText}&page=${page}&pageSize=${pageSize}`);
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
            const res = await axiosInstance.post(`/edit/audios/upload-csv`, obj);
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
    async batchUploadAudio(formData) {
        try {
            const res = await axiosInstance.post(`/edit/audios/upload`, formData);
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
    async batchAudioExport(voiceIds) {
        try {
            const res = await axiosInstance.post(`/edit/audios/export`, voiceIds,{
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
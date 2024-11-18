import { axiosInstance } from '../utils/helpers/fetch-wrapper';

export default {
    // 跳過新增圖檔直接上傳
    async importWordFile(formData) {
        try {
            const res = await axiosInstance.post(`/edit/words/batchImport`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }});

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
                errorData: error.response.data.data.errorRows,
            }
        }
    },
}
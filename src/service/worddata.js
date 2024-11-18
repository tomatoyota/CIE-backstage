import { axiosInstance } from '../utils/helpers/fetch-wrapper';

export default {
    // 異動歷程
    async getHistoryList (wordId) {
        try {
            const res = await axiosInstance.get(`/general/words/changes/${wordId}`);

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
    }
}
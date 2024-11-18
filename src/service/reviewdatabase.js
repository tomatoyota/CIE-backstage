import { axiosInstance } from '../utils/helpers/fetch-wrapper';

export default {
    // 檢核區列表(搜尋)
    async getReviewdbList(page = 1, searchCondition = {
        submitStartDate: '', // 送審時間(起)
        submitEndDate: '', // 送審時間(訖)
        wordName: '', // 字詞名
        definition: '', // 釋義
        pinyin: '', // 漢語拼音
        zhuyin: '', // 注音
        creator: '', // 建立者
        editor: '', // 修改者
        sourceAction: '',// 來源動作
        sortBy: '',
        sortDirection: ''
    }, pageSize) {
        try {
            const res = await axiosInstance.post(`review/words/search?page=${page}&pageSize=${pageSize}&submitStartDate=${searchCondition.submitStartDate}&submitEndDate=${searchCondition.submitEndDate}&wordName=${searchCondition.wordName}&definition=${searchCondition.definition}&pinyin=${searchCondition.pinyin}&zhuyin=${searchCondition.zhuyin}&creator=${searchCondition.creator}&editor=${searchCondition.editor}&sourceAction=${searchCondition.sourceAction}&sortBy=${searchCondition.sortBy}&sortDirection=${searchCondition.sortDirection}`);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg,
                    data: res.data
                }
            };

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
    // 下拉選單
    async getSearchList() {
        try {
            const res = await axiosInstance.get(`/review/editStatus`);

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
    // 鎖定字詞狀態(後端改為審核中)
    async lockEditWord(editWordId) {
        try {
            const res = await axiosInstance.post(`/review/words/lock/${editWordId}`);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };

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
    // 預覽
    async getReviewDetail(editWordId) {
        try {
            const res = await axiosInstance.get(`/review/words/preview/${editWordId}`);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };
        
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
    // 通過/選取詞條通過
    async passReviewWords(editWordIds) {
        try {
            const res = await axiosInstance.put(`/review/words/approve`, { editWordIds });

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };
        
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
    // 退回/選取詞條退回
    async rejectReviewWords(words) {
        try {
            const rejectWords = words.map((item) => ({ editWordId: item.editWordId, reviewedMessage: item.reviewedMessage }))
            const res = await axiosInstance.post(`/review/words/return`, rejectWords);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };
        
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
    async getReviewerList() {
        try {
            const res = await axiosInstance.get(`/review/auditUserAccounts`);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };
        
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
    async transferAudit(obj) {
        try {
            const res = await axiosInstance.post(`/review/transferAudit`, obj);
            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };
        
            return {
                isSuccess: true,
                msg: res.data.rtnMsg
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
}
import { axiosInstance } from '../utils/helpers/fetch-wrapper';

export default {
    // 總資料庫區列表(搜尋)
    async getAlldbList(page = 1, searchCondition = {
        startDate: '',
        endDate: '',
        changeStartDate: '',
        changeEndDate: '',
        wordName: '',
        definition: '',
        pinyin: '',
        zhuyin: '',
        editStatus: '',
        shelfStatus: '',
        creator: '',
        editor: '',
        sortBy: '',
        sortDirection: ''
    }, pageSize) {
        try {
            const res = await axiosInstance.post(`general/words/search?page=${page}&pageSize=${pageSize}&startDate=${searchCondition.startDate}&endDate=${searchCondition.endDate}&changeStartDate=${searchCondition.changeStartDate}&changeEndDate=${searchCondition.changeEndDate}&wordName=${searchCondition.wordName}&definition=${searchCondition.definition}&pinyin=${searchCondition.pinyin}&zhuyin=${searchCondition.zhuyin}&editStatus=${searchCondition.editStatus}&shelfStatus=${searchCondition.shelfStatus}&creator=${searchCondition.creator}&editor=${searchCondition.editor}&sortBy=${searchCondition.sortBy}&sortDirection=${searchCondition.sortDirection}`);

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
            const res = await axiosInstance.get(`/general/editStatus`);

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
    // 預覽
    async getWordDetail(wordId) {
        try {
            const res = await axiosInstance.get(`/general/words/preview/${wordId}`);

            if (res === null || res.data === null) {
                return null
            };

            if (res.data.rtnCode !== '0000') {
                return {
                    isSuccess: false,
                    msg: res.data.rtnMsg
                }
            };

            // 轉換
            res.data.data.editDefinitions = res.data.data.defs;

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
    // 編輯/移入編輯區(總資料庫區)
    async editWord(wordIds, editAction) {
        try {
            const res = await axiosInstance.post(`/general/words/edit`, { wordIds, editAction });

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
    // 匯出選取詞條
    async exportWords(obj) {
        try {
            const res = await axiosInstance.post(`/general/words/export`, obj, { responseType: 'blob' });

            if (res.headers['content-type'].includes('application/json')) {
                const text = await res.data.text();
                const json = JSON.parse(text);
    
                if (json.rtnCode) {
                    return {
                        isSuccess: false,
                        msg: `${json.rtnMsg}(${json.rtnCode})`
                    }
                }
            }
    
            return {
                isSuccess: true,
                data: res
            };
        } catch (error) {
            let errorMsg = error.message;
            if (error.response && error.response.data) {
                const reader = new FileReader();
                reader.onload = () => {
                    const text = reader.result;
                    try {
                        const json = JSON.parse(text);
                        errorMsg = json.rtnMsg || error.message;
                    } catch (e) {
                        errorMsg = text;
                    }
                };
                reader.readAsText(error.response.data);
            }
    
            return {
                isSuccess: false,
                msg: errorMsg
            };
        }
    },
    
    // 上架/選取詞條上架
    async publishWord(wordIds) {
        try {
            const res = await axiosInstance.put(`/general/words/publish`, { wordIds });

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
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 下架/選取詞條下架
    async unpublishWord(wordIds, reason) {
        try {
            const res = await axiosInstance.put(`/general/words/unpublish`, { wordIds, reason });

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
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
    // 選取詞條刪除
    async deleteWord(obj) {
        try {
            const res = await axiosInstance.delete(`/general/words/delete`, { data: obj });

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
                isSuccess: true
            }
        } catch (error) {
            return {
                isSuccess: false,
                msg: error.response.data.rtnMsg
            }
        }
    },
}
import { defineStore } from 'pinia';

export const useReviewdbStore = defineStore('reviewdb', {
    state: () => ({
        searchCondition: { // 查詢條件
            submitStartDate: '', // 送審時間(起)
            submitEndDate: '', // 送審時間(訖)
            wordName: '', // 字詞名
            definition: '', // 釋義
            pinyin: '', // 漢語拼音
            zhuyin: '', // 注音
            creator: '', // 建立者
            editor: '', // 修改者
            sourceAction: '',// 來源動作
            sortBy: 'createdAt',
            sortDirection: 'DESC'
        },
        reviewdbList: [],
        reviewdbPagination: {},
        headers: [ // 標題
            {
                title: '字詞名',
                value: 'word_text',
                sort: '',
                width: '15%'
            },
            {
                title: '漢語拼音',
                value: 'pinyin',
                sort: '',
                width: ''
            },
            {
                title: '注音',
                value: 'zhuyin',
                sort: '',
                width: '10%'
            },
            {
                title: '來源動作',
                value: 'status',
                sort: '',
                width: '10%'
            },
            {
                title: '送審時間',
                value: 'createdAt',
                sort: '',
                width: ''
            },
            {
                title: '建立者',
                value: 'creator',
                sort: '',
                width: ''
            }
        ],
        actionList: [], // 來源動作(下拉選單)
        selectedList: [], // checkbox 選取
        selectedWord : [], // 單筆選取
        allWordIds: [], // 搜尋結果所有字詞 ID
    }),
    actions: {
        setReviewdbList(list, pagination) {
            this.reviewdbList = list;
            this.reviewdbPagination = pagination
        },
        setAllWordIds(allWordIds){
            this.allWordIds = allWordIds
        },
        // 清除結果
        clearCondition() {
            this.searchCondition = {
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
            }
        },
        // 下拉選單
        setSearchList(list) {
            // 加 all
            const all = [{ action: '', description: '所有來源動作' }, ...list];
            
            this.actionList = all.map((status) => {return { title: status.description, val: status.action }});
        }
    }
});
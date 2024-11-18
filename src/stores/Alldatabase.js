import { defineStore } from 'pinia';

export const useAlldbStore = defineStore('alldb', {
    state: () => ({
        searchCondition: { // 查詢條件
            startDate: '', // 建立時間(起)
            endDate: '', // 建立時間(訖)
            changeStartDate: '', // 異動時間(起)
            changeEndDate: '', // 異動時間(迄)
            wordName: '', // 字詞名
            definition: '', // 釋義
            pinyin: '', // 漢語拼音
            zhuyin: '', // 注音
            editStatus: '', // 字詞狀態
            shelfStatus: '', // 上下架狀態
            creator: '', // 建立者
            editor: '', // 修改者
            sortBy: 'updatedAt',
            sortDirection: 'DESC'
        },
        alldbList: [],
        alldbPagination: {},
        headers: [ // 標題
            {
                title: '字詞名',
                value: 'word_text',
                sort: '',
                width: '10%'
            },
            {
                title: '漢語拼音',
                value: 'pinyin',
                sort: '',
                width: '8%'
            },
            {
                title: '注音',
                value: 'zhuyin',
                sort: '',
                width: '10%'
            },
            {
                title: '字詞狀態',
                value: 'status',
                sort: '',
                width: '8%'
            },
            {
                title: '是否上架',
                value: 'publish_toggle',
                sort: '',
                width: '10%'
            },
            {
                title: '建立時間',
                value: 'createdAt',
                sort: '',
                width: ''
            },
            {
                title: '建立者',
                value: 'creator',
                sort: '',
                width: ''
            },
            {
                title: '異動時間',
                value: 'updatedAt',
                sort: '',
                width: ''
            },
            {
                title: '修改者',
                value: 'editor',
                sort: '',
                width: ''
            }
        ],
        statusList: [], // 字詞狀態(下拉選單)
        toggleList: [], // 上下架狀態(下拉選單)
        selectedList: [], // checkbox 選取
        selectedWord : [], // 單筆選取
        allWordIds: [] // 搜尋結果所有字詞 ID
    }),
    actions: {
        setAlldbList(list, pagination) {
            this.alldbList = list;
            this.alldbPagination = pagination
        },
        setAllWordIds(allWordIds){
            this.allWordIds = allWordIds
        },
        // 清除結果
        clearCondition() {
            this.searchCondition = {
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
            }
        },
        // 下拉選單
        setSearchList(list) {
            // 字詞狀態
            const statusAll = [{ wordNumber: '', wordNameZh: '所有字詞狀態', wordName: 'all' }, ...list.statuses];
            this.statusList = statusAll.map((status) => {return { title: status.wordNameZh, val: status.wordNumber }});
            // 上下架
            const toggleAll = [{ description: '所有狀態', publishToggle: '' }, ...list.publishToggle];
            this.toggleList = toggleAll.map((toggle) => {
                return { 
                    title: toggle.description, 
                    val: typeof toggle.publishToggle === 'boolean' ? toggle.publishToggle : '' 
                };
            });
        }
    }
});
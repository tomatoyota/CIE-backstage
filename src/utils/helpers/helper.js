export default {
    // 編輯狀態顏色套用(總資料庫區)
    alldbEditStatusStyle(status) {
        switch (status) {
            case 0:
                return 'word-general';
            case 1:
            case 3:
                return 'word-edit';
            case 2:
                return 'word-aduit';
        }
    },
    // 編輯狀態文字對應(總資料庫區)
    alldbStatusText(status){
        switch (status) {
            case 0:
                return '一般';
            case 1:
                return '編輯中';
            case 2:
                return '審核中';
            case 3:
                return '匯出編輯鎖定';
        }
    },
    // 來源動作顏色套用(檢核區)
    reviewdbEditActionStyle(status) {
        switch (status) {
            case 'create':
                return 'word-general';
            case 'export':
            case 'edit':
                return 'word-edit';
            case 'submit':
            case 'publish':
                return 'word-submit';
            case 'delete':
                return 'word-delete';
            case 'unpublish':
                return 'word-unpublish';
            case 'batchEdit':
                return 'word-edit';
        }
    },
    // 來源動作文字對應(檢核區)
    reviewdbActionText(status) {
        switch (status) {
            case 'delete':
                return '刪除字詞';
            case 'create':
                return '新增字詞';
            case 'edit':
                return '字詞移入編輯區';
            case 'export':
                return '匯出編輯';
            case 'submit':
                return '提交審核';
            case 'publish':
                return '上架';
            case 'unpublish':
                return '下架';
            case 'batchEdit':
                return '批次修改';
        }
    },
    historyActionText(status) {
        switch (status) {
            case 'delete':
                return '刪除字詞';
            case 'create':
                return '新增字詞';
            case 'edit':
                return '字詞移入編輯區';
            case 'bulkImportToEdit':
                return '批次匯入送編';
            case 'export':
                return '匯出編輯';
            case 'submit':
                return '提交審核';
            case 'publish':
                return '上架';
            case 'unpublish':
                return '下架';
            case 'approve':
                return '審核通過';
            case 'reject':
                return '審核不通過退回';
            case 'rollback':
                return '編輯區退回';
            case 'transferAudit':
                return '轉讓審核';
            case 'batchEdit':
                return '批次修改';
            default:
                return '';
        }
    },
    // 解析 base64
    parseBase64 (file) {
        let base64String = file.replace(/[^A-Za-z0-9+/=]/g, '');
    
        // 解碼成圖片
        let binaryString = atob(base64String);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
    
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        let blob = new Blob([bytes], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    }
}
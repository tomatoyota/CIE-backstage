export default {
    // 檢查是否空值
    checkNull(value) {
        if (value) return true;
        return '此欄位為必填'
    },
}
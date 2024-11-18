<template>
    <v-table class="mt-4">
        <thead>
            <tr class="py-0">
                <th class="text-center small-text" v-for="header in headers" :width="header.width">
                    {{ header.title }}
                </th>
            </tr>
        </thead>
        <template v-for="(errorItem, errorIndex) in errorData" :key="errorIndex">
            <tr v-for="(rowItem, rowIndex) in errorItem.rows" :key="rowItem.row" class="border-all">
                
                <td v-if="!rowItem.data" class="text-center">{{ rowItem.row }}</td>
                
                <template v-if="!rowItem.data">
                    <template v-for="(errColItem, errColIndex) in rowItem.errColumns" :key="errColItem.col">
                        
                        <td v-if="errColItem.col === 2">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errorItem.wordText }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>
                        <td v-if="errColItem.col === 3">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 4">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 5">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 6">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 7">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 8">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 9">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 10">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 11">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 12">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>

                        <td v-if="errColItem.col === 13">
                            <p :class="errColItem.errMsg ? '' : 'mb-0'">{{ errColItem.originalInput }}</p>
                            <p v-if="errColItem.errMsg" class="text-alert">{{ errColItem.errMsg }}</p>
                        </td>
                        
                        <td v-if="errColItem.col === 14">
                            <p v-if="errColItem.authError" class="text-alert"><span class="title">權限錯誤</span><br>{{ errColItem.authError }}</p>
                            <p v-if="errColItem.statusError" class="text-alert"><span class="title">字詞狀態錯誤</span><br>{{ errColItem.statusError }}</p>
                        </td>
                    </template>
                </template>
                
            </tr>
        </template>
    </v-table>
    
</template>

<script>

export default {
    props:{
        errorData: Array,
        errorMsg: String
    },
    emits: ['cleanError'],
    data() {
        return {
            headers:[
                { title: '列', width: '5%' },
                { title: '詞目', width: '6%' },
                { title: '注音', width: '6%' },
                { title: '漢語拼音', width: '6%' },
                { title: '義項序', width: '6%' },
                { title: '詞類', width: '6%' },
                { title: '英譯', width: '6%' },
                { title: '釋義', width: '6%' },
                { title: '搭配詞', width: '6%' },
                { title: '例句', width: '6%' },
                { title: '情境分類', width: '6%' },
                { title: '詞彙等級', width: '6%' },
                { title: '近義詞', width: '6%' },
                { title: '反義詞', width: '6%' },
                { title: '錯誤說明', width: '6%' },
            ],
            errorList: [],
            errorShowList: []
        };
    },
    methods:{
        cleanData(){
       
        },
        clearErrorData() {
            this.$emit('cleanError');
        }
    },
    watch: {
        errorData: {
            handler(n) {
                if(n){
                    this.errorList = n;
                    this.cleanData();
                }
            },
            immediate: true
        }
    }
}

</script>
<style lang="scss">
.text-alert{
    color: #FE7C7C;
    font-size: 12px;
    font-weight: 400;
    padding: 0 4px;
    .title{
        font-weight: 900;
        font-size: 14px;
    }
}
.small-text{
    font-size: 13px;
}
.border-all{
    border: 1px solid #d9d9d9
}
</style>
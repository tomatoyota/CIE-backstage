<template>
    <div class="">
        <v-table class="mt-4">
            <thead>
                <tr>
                    <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
                        {{ header.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(errorItem, errorIndex) in errorData" :key="errorIndex">
                    <tr v-for="(rowItem, rowIndex) in errorItem.rows" :key="rowItem.row">
                        <td>{{ rowItem.row }}</td>
                        <td>{{ errorItem.wordText }}</td>
                        
                        <template v-for="errColItem in rowItem.errColumns" :key="errColItem.col">
                            <td class="error">
                                <p>{{ errColItem.originalInput }}</p>
                                <p class="error-msg">{{ errColItem.errMsg }}</p>
                                
                                <p v-if="errColItem.authError">
                                    <p class="mb-1 title">權限錯誤</p>
                                    <p>{{ errColItem.authError }}</p>
                                </p>
                                
                                <p v-if="errColItem.statusError">
                                    <p class="mb-1 title">狀態錯誤</p>
                                    <p>{{ errColItem.statusError }}</p>
                                </p>
                            </td>
                        </template>

                    </tr>
                </template>
            </tbody>
        </v-table>
    </div>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
    props:{
        errorData: Array
    },
    components: { 
        PaginationComponent,
    },
    data() {
        return {
            headers:[
                {
                    title: '列',
                    value: 'word_text',
                    sort: '',
                    width: '5%'
                },
                {
                    title: '字詞名',
                    value: '',
                    sort: '',
                    width: '10%'
                },
                {
                    title: '義項序',
                    value: '',
                    sort: '',
                    width: '10%'
                },
                {
                    title: '音檔名稱',
                    value: 'audio_name',
                    sort: '',
                    width: '25%'
                },
                {
                    title: '音檔說明',
                    value: '',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '音檔來源',
                    value: '',
                    sort: '',
                    width: '10%'
                },
                {
                    title: '錯誤說明',
                    value: '',
                    sort: '',
                    width: '10%'
                },
            ],
        };
    },
    
    mounted(){
    },
    methods:{
        
    },
}

</script>

<style lang="scss" scoped>
.error{
    color: #FF0000;
}
.title{
    font-weight: 900;
    font-size: 14px;
}
</style>
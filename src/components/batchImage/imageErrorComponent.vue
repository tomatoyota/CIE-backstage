<template>
    <div class="">
        <v-row class="align-center">
            <v-col>
                <v-tabs
                v-model="tab"
                color="primary"
                v-if="imageErrorData.errorData.length > 0"
                >
                    <v-tab value="1">全部 <span class="tabCount">{{ imageErrorData.allData.length }}</span></v-tab>
                    <v-tab value="2">正確資料 <span class="tabCount">{{ imageErrorData.correctData.length }}</span></v-tab>
                    <v-tab value="3">錯誤資料 <span class="tabCount">{{ imageErrorData.errorData.length }}</span></v-tab>
                </v-tabs>
                <p v-else class="mb-0">圖檔與Excel對比無誤 <v-icon icon="mdi mdi-check-circle" color="success"></v-icon></p>
            </v-col>
            <v-col class="text-end">
                <v-btn variant="flat" color="#e3e3e3" class="mr-2" @click="previousPage()">回列表頁</v-btn>
                <v-btn variant="flat" color="#e3e3e3" v-if="imageErrorData.errorData.length > 0" @click="clearPage()">重新上傳</v-btn>
                <v-btn variant="flat" color="primary" v-else @click="batchUploadImage">上傳到資料庫</v-btn>
            </v-col>
        </v-row>
        
        <v-table class="mt-4">
            <thead>
                <tr>
                    <th class="text-left" v-for="header in headers" :key="header.value" :width="header?.width">
                        {{ header.title }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(errorItem, errorIndex) in tableItems" :key="errorIndex">
                    <tr>
                        <td>{{ errorItem.row }}</td>
                        <td>{{ errorItem.wordText }}</td>
                        <td>{{ errorItem.sequences }}</td>
                        <td>{{ errorItem.images }}</td>
                        <td>{{ errorItem.imageInfo }}</td>
                        <td>{{ errorItem.imageSource }}</td>
                        <td class="error">{{ errorItem.errorInfo }}</td>
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
        imageErrorData: Array,
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
                    title: '圖片檔案名稱',
                    value: 'image_name',
                    sort: '',
                    width: '25%'
                },
                {
                    title: '圖片說明',
                    value: '',
                    sort: '',
                    width: '15%'
                },
                {
                    title: '圖片來源',
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
            tableItems: null,
            tab: '1',
        };
    },
    watch:{
        imageErrorData: {
            handler(n) {
                if(n){
                    this.cleanData();
                }
                
            },
            immediate: true
        },
        tab: {
            handler(n) {
                if(n === '1'){
                    this.tableItems = this.imageErrorData.allData;
                }else if (n === '2'){
                    this.tableItems = this.imageErrorData.correctData;
                }else if (n === '3'){
                    this.tableItems = this.imageErrorData.errorData
                }
                
            },
            immediate: true
        },
    },
    methods:{
        clearPage(){
            this.$emit('clearPage')
        },
        previousPage(){
            this.$emit('previouspage')
        },
        cleanData(){
            this.tableItems = this.imageErrorData.allData
        },
        batchUploadImage(){
            this.$emit('uploadImage')
        }
    },
}

</script>

<style lang="scss" scoped>
.error{
    color: #FF0000
}
.tabCount{
    background-color: #FF0000;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 100px;
    padding-top: 5px;
    text-align: center;
    margin-left: 5px;
    font-size: 12px;
}
</style>
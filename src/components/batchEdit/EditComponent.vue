<template>
    <!-- 刪除、選取詞條刪除 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">批次修改</h5>
        </v-card-title>
        <v-card-text>
            <v-form v-model="validation">
                <v-row>
                    <p class="mt-2 mb-0 ps-3">共選取{{ checkItem.length }}筆資料</p>
                    <v-col cols="12" class="py-2">
                        <v-select
                        label="修改欄位"
                        :items="editCol"
                        v-model="selectedCol"
                        item-title="label"
                        item-value="value"
                        variant="outlined"
                        hide-details
                        multiple
                        ></v-select>
                    </v-col>
                    <v-col cols="6" class="py-2">
                        <v-text-field variant="outlined" label="目標值" hide-details v-model="targetValue"></v-text-field>
                    </v-col>
                    <v-col cols="6" class="py-2 d-flex align-center">
                        <v-text-field variant="outlined" label="修改值" hide-details v-model="editValue"></v-text-field>
                        <v-tooltip text="若要移除目標值，請輸入 $delete" location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi mdi-information" class="ml-2"></v-icon>
                            </template>
                        </v-tooltip>
                    </v-col>
                </v-row>
            </v-form>
            
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeDialog"
            >
                取消
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                class="font-weight-bold"
                @click="submit"
                :disabled="targetValue === null || editValue === null || selectedCol.length === 0"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>

    <LoadingComponent :loading="loading"/>
</template>

<script>
import alldatabaseSrv from '@/service/alldatabase';
import editSrv from '@/service/dataEdit.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    props: {
        checkItem: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        LoadingComponent
    },
    data(){
        return{
            editCol: [
                    // {
                    //     label: '字詞名',
                    //     value: 'wordName'
                    // },
                    {
                        label: '釋義',
                        value: 'definition'
                    },
                    {
                        label: '漢語拼音',
                        value: 'pinyin'
                    },
                    {
                        label: '注音',
                        value: 'zhuyin'
                    },
                    {
                        label: '英文釋義',
                        value: 'definitionTranslated'
                    },
                    {
                        label: '例句',
                        value: 'exampleSentence'
                    },
                    {
                        label: '用法',
                        value: 'collocation'
                    },
                    {
                        label: '近義詞',
                        value: 'synonym'
                    },
                    {
                        label: '反義詞',
                        value: 'antonym'
                    },
            ],
            selectedCol:[],
            targetValue: null,
            editValue: null,
            loading: false,
            validation: false
        }
    },
    emits: ['close-dialog', 'get-list'],
    methods:{
        closeDialog(){
            this.$emit('close-dialog');
        },
        submit(){
            this.loading = true
            const wordIds = [];
            const editAction = '2';
            
            this.checkItem.forEach((item) => {
                wordIds.push(item.wordId)
            })

            // 移入編輯區
            alldatabaseSrv.editWord(wordIds, editAction).then((res) => {
                if(res.isSuccess){
                    const editWordIdRes = JSON.parse(res.data);

                    this.checkItem.forEach((item) => {
                        const matchedItem = editWordIdRes.find(editItem => editItem.word === item.wordId);
                        if (matchedItem) {
                            item.editWordId = matchedItem.editWord;
                        }
                    });

                    this.getEditData(this.checkItem);
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    }).then((result) => {
                    if(result.isConfirmed){
                        this.loading = false;
                        this.$emit('get-list');
                        this.$emit('close-dialog');
                    }
                });
                }
            });
        },
        // 取得編輯資料
        getEditData(wordAry, errorAry) {
            const editDataAry = [];
            const promises = wordAry.map((item) => {
                let id = {
                    editWordIds: [item.editWordId]
                };
                return editSrv.editWord(id).then((res) => {
                    if (res.isSuccess) {
                        editDataAry.push(res.data);
                    }
                });
            });

            Promise.all(promises).then(() => {
                this.editData(editDataAry, errorAry);
            });
        },
        // 編輯資料
        editData(editDataAry, errorAry) {
            const checkData = this.checkItem;
            const editCol = this.selectedCol;
            const modifiedDataAry = []

            for (let i = 0; i < checkData.length; i++) {
                const editData = {
                    action: 'update',
                    wordId: checkData[i].wordId,
                    wordName: checkData[i].wordName,
                    definitions: []
                };
                
                const matchWord = editDataAry.find(item => item.editWordId === checkData[i].editWordId);
                for (let j = 0; j < matchWord.editDefinitions.length; j++) {
                    let definition = {
                        editDefinitionId: matchWord.editDefinitions[j].editDefinitionId,
                        action: 'update',
                        sequence: matchWord.editDefinitions[j].definitionSequence,
                    };
                    editData.definitions.push(definition);
                }
                
                if(this.editValue === '$delete'){
                    this.editValue = ''
                }
                for (let k = 0; k < matchWord.editDefinitions.length; k++) {
                    if (editCol.includes('definition') && matchWord.editDefinitions[k].definitionText !== '' && matchWord.editDefinitions[k].definitionText !== null) {
                        editData.definitions[k].definitionText = matchWord.editDefinitions[k].definitionText.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('pinyin') && matchWord.editDefinitions[k].pronunDetails.pinyin !== '' && matchWord.editDefinitions[k].pronunDetails.pinyin !== null) {
                        editData.definitions[k].pinyin = matchWord.editDefinitions[k].pronunDetails.pinyin.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('zhuyin') && matchWord.editDefinitions[k].pronunDetails.zhuyin !== '' && matchWord.editDefinitions[k].pronunDetails.zhuyin !== null) {
                        editData.definitions[k].zhuyin = matchWord.editDefinitions[k].pronunDetails.zhuyin.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('definitionTranslated') && matchWord.editDefinitions[k].definitionTranslated !== '' && matchWord.editDefinitions[k].definitionTranslated !== null) {
                        const definitionTranslated = {
                                definitionText_en: matchWord.editDefinitions[k].definitionTranslated.replace(new RegExp(this.targetValue, 'g'), this.editValue),
                                language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                        }
                        editData.definitions[k].trans = definitionTranslated
                    }
                    if (editCol.includes('exampleSentence') && matchWord.editDefinitions[k].exampleSentence !== '' && matchWord.editDefinitions[k].exampleSentence !== null) {
                        editData.definitions[k].exampleSentence = matchWord.editDefinitions[k].exampleSentence.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('collocation') && matchWord.editDefinitions[k].collocation !== '' && matchWord.editDefinitions[k].collocation !== null) {
                        editData.definitions[k].collocation = matchWord.editDefinitions[k].collocation.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('synonym') && matchWord.editDefinitions[k].synonyms.length > 0 && matchWord.editDefinitions[k].synonyms[0].wordText !== '' && matchWord.editDefinitions[k].synonyms[0].wordText !== null) {
                        editData.definitions[k].synonyms = matchWord.editDefinitions[k].synonyms[0].wordText.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                    if (editCol.includes('antonym') && matchWord.editDefinitions[k].antonyms.length > 0 && matchWord.editDefinitions[k].antonyms[0].wordText !== '' && matchWord.editDefinitions[k].antonyms[0].wordText !== null) {
                        editData.definitions[k].antonyms = matchWord.editDefinitions[k].antonyms[0].wordText.replace(new RegExp(this.targetValue, 'g'), this.editValue);
                    }
                }

                modifiedDataAry.push(editData)
            }
            this.save(modifiedDataAry, errorAry)
        },
        // 儲存
        async save(modifiedDataAry, errorAry) {
            try {
                const res = await Promise.all(modifiedDataAry.map(async (editData) => {
                    return await editSrv.saveEdit(editData);
                }));
            } catch (error) {
                
            } finally {
                this.loading = false;
                Swal.fire({
                    toast: true,
                    position: 'center',
                    title: `完成批次修改`,
                    confirmButtonColor: '#0E2A34',
                    confirmButtonText: '確認',
                    background: '#F0F0F2',
                    width: 400
                }).then((result) => {
                    if(result.isConfirmed){
                        // if(errorAry.length > 0){
                        //     this.showError(errorAry)
                        // }else{
                            this.$emit('get-list');
                            this.$emit('close-dialog');
                        // }
                    }
                });
            }
        },
        // 彈窗顯示 error
        showError(errorAry){
            Swal.fire({
                toast: true,
                position: 'center',
                title: errorAry.join('<br>'),
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
            }).then((result) => {
                if(result.isConfirmed){
                    this.$emit('get-list');
                    this.$emit('close-dialog');
                }
            });
        },
    }
};
</script>
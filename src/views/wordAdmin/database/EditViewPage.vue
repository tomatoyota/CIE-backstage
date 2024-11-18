<template>
    <div class=" pb-10 mb-10">
        <h4>字詞資料</h4>
        <v-tabs
        v-model="tab"
        v-if="editData.length > 1"
        >
            <v-tab
            v-for="(item, index) in editData"
            :value="item"
            :key="item"
            @click="setCurrentItem(index)"
            >
                {{ item.wordText }}
            </v-tab>
        </v-tabs>
        
        <v-window
        v-model="tab"
        >
            <v-window-item
            v-for="(item, index) in editData"
            :value="item"
            :key="item"
            class="pt-4"
            >
                <EditComponent
                :index="index"
                :editDataDetail="item"
                @updateData="updateEditdata"
                @validation="validation"
                ></EditComponent>

            </v-window-item>
        </v-window>

        <div class="buttonGroup text-center mt-8">
            <v-btn
            flat
            color="normal"
            class="mr-2"
            @click="backToList()"
            >
                返回列表
            </v-btn>
            <v-btn
            variant="flat"
            color="warning"
            class="mr-2"
            :disabled="!validate"
            @click="preview()"
            >
                預覽
            </v-btn>

            <!-- 新增 -->
            <v-btn
            v-if="!isEdit"
            color="success"
            variant="flat"
            class="mr-2"
            :disabled="!validate"
            @click="addWord()"
            >
                儲存
            </v-btn>

            <!-- 編輯 -->
            <v-btn
            v-else
            color="success"
            variant="flat"
            class="mr-2"
            :disabled="!validate"
            @click="save('save')"
            >
                儲存
            </v-btn>
            <v-btn
            color="#1976D2"
            variant="flat"
            :disabled="!validate"
            @click="saveAndSubmit('saveAndSubmit')"
            >
                儲存並送審
            </v-btn>
        </div>
    </div>
    <LoadingComponent :loading="loading"/>
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import EditComponent from '@/components/EditWordTextComponent.vue'
import editSrv from '@/service/dataEdit.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    components:{
        EditComponent,
        LoadingComponent,
    },
    data() {
        return {
            tab: null,
            editData:[],
            selectItem: [],
            isEdit: false,
            editDataDefault: {
                action: 'create',
                wordId: null,
                wordName: '',
                editDefinitions: [
                    {
                        sequence: 1,
                        classification: null,
                        collocation:'',
                        collocastionTranslated:'',
                        definitionId:'',
                        definitionText:'',
                        definitionTranslated:'',
                        editDefinitionId:'',
                        exampleSentence:'',
                        exampleSentenceTranslated:'',
                        imageFiles:[],
                        imagePreview:[],
                        level: null,
                        partOfSpeechName: '',
                        pronunDetails: {
                            pinyin: '',
                            zhuyin: ''
                        },
                        synonyms: '',
                        antonyms: '',
                        voiceFiles: [],
                        wordTextTranslated: '',
                    }
                ]
            },
            originalEditData: [],
            validate: false,
            currentItem: 0,
            loading: false,
        };
    },
    created(){
        this.getEditViewDropdown()
    },
    methods:{
        async getEditViewDropdown(){
            editSrv.getEditViewDropdown().then((res) => {
                this.selectItem = res.data
                const store = useEditdbStore();
                store.updateEditStatus(this.selectItem);
                this.getWord()
            })
        },
        getWord(){
            let wordTextInfo = JSON.parse(localStorage.getItem('editData'))
            
            if(wordTextInfo){
                if(!Array.isArray(wordTextInfo)){
                    wordTextInfo = [wordTextInfo]
                }
                this.editData = wordTextInfo
                this.originalEditData = wordTextInfo
                if(this.editData.length === 1){
                    this.tab = this.editData[0]
                }
                this.isEdit = true
            }else{
                this.editData.push(this.editDataDefault)
                this.tab = this.editData[0]
                this.isEdit = false
            } 
        },
        backToList(){
            this.$router.push({ 
                path: '/admin/DataEdit',
                query: { action: 'reset' }
            });
        },
        addWord(){
            const editData = this.editData[this.currentItem]
            const wordData = {
                action: 'create',
                wordId: '',
                wordName: editData.wordText,
                definitions:[]
            }
            editData.editDefinitions.forEach((i, index) => {
                const definition = {
                    editDefinitionId: i.editDefinitionId || '',
                    action: 'create',
                    sequence: index + 1,
                    classification: i.classification  || '',
                    level: i.level  || '',
                    definitionText: i.definitionText  || '',
                    trans: {
                        definitionText_en: i.definitionTranslated  || '',
                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                    },
                    pinyin: i.pronunDetails.pinyin  || '',
                    zhuyin: i.pronunDetails.zhuyin  || '',
                    exampleSentence: i.exampleSentence  || '',
                    collocation: i.collocation  || '',
                    partOfSpeech: i.partOfSpeechName  || '',
                    synonyms: i.synonyms  || '',
                    antonyms: i.antonyms  || '',
                    image: i.imageFiles,
                    voice: []
                }
                if(typeof definition.zhuyin === 'object'){
                    definition.zhuyin = definition.zhuyin.join(' ')
                }
                if(i.voiceTemp){
                    // definition.voice.push(i.voiceTemp)
                    definition.voice = i.voiceTemp
                }

                if(definition.trans.definitionText_en === ''){
                    delete definition.trans
                }
                if(definition.image.length === 0){
                    delete definition.image
                }
                if(definition.voice.length === 0){
                    delete definition.voice
                }
                if(definition.zhuyin && definition.zhuyin !== ''){
                    definition.pinyinChecked = definition.pinyin
                }
                for (const key in definition) {
                    if (definition[key] === '' && key !== 'editDefinitionId') {
                        delete definition[key];
                    }
                }
                wordData.definitions.push(definition)
            })
            editSrv.addWord(wordData).then((res) => {
                if(res.data.rtnCode === '0000'){
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.$router.push('/admin/DataEdit')
                        }
                    });
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
            })
        },
        save(){
            this.loading = true
            const editData = this.editData[this.currentItem]
            const wordTextInfo = JSON.parse(localStorage.getItem('editData'))
            const j = wordTextInfo.editDefinitions
            const wordData = {
                action: 'update',
                wordId: editData.wordId || '',
                wordName: editData.wordText,
                definitions:[]
            }
            editData.editDefinitions.forEach((i, index) => {
                let definition = {
                    editDefinitionId: i.editDefinitionId || '',
                    action: i.editDefinitionId ? 'update' : 'create',
                    sequence: index + 1,
                    classification: i.classification,
                    level: i.level,
                    definitionText: i.definitionText,
                    trans: {
                        definitionText_en: i.definitionTranslated,
                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                    },
                    pinyin: i.pronunDetails.pinyin,
                    zhuyin: i.pronunDetails.zhuyin,
                    exampleSentence: i.exampleSentence || '',
                    collocation: i.collocation || '',
                    partOfSpeech: i.partOfSpeechName,
                    synonyms: i.synonyms || [],
                    antonyms: i.antonyms || [],
                    image: this.tidyImage(i.imageFiles),
                    voice: i.voiceTemp
                }
                if(typeof definition.zhuyin === 'object'){
                    definition.zhuyin = definition.zhuyin.join(' ')
                }
                // 更新內容
                if(i.editDefinitionId && j[index].editDefinitionId){
                    if(i.editDefinitionId === j[index].editDefinitionId){
                    
                        if(definition.action === 'update'){
                            let originalDefinition = null
                            originalDefinition = {
                                classification: j[index].classifyName,
                                level: j[index].level,
                                definitionText: j[index].definitionText,
                                trans: {
                                    definitionText_en: j[index].definitionTranslated,
                                    language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                                },
                                pinyin: j[index].pronunDetails.pinyin,
                                zhuyin: j[index].pronunDetails.zhuyin,
                                exampleSentence: j[index].exampleSentence,
                                collocation: j[index].collocation,
                                partOfSpeech: j[index].partOfSpeechName,
                                synonyms: this.combineSynonyms(j[index].synonyms),
                                antonyms: this.combineSynonyms(j[index].antonyms),
                                image: j[index].imageFiles,
                                voice: j[index].voiceFiles
                            }
                            // 判斷圖片是否有不同
                            if (definition.hasOwnProperty('image')) {
                                
                                if (definition.image && definition.image.length === originalDefinition.image.length) {
                                    let allImageFileNamesMatch = true;
                                    for (let i = 0; i < definition.image.length; i++) {
                                        if (definition.image[i].file_name !== originalDefinition.image[i].originalFileName) {
                                            allImageFileNamesMatch = false;
                                            break;
                                        }
                                    }
                                    if (allImageFileNamesMatch) {
                                        delete definition.image;
                                    }
                                }else if(definition.image && definition.image.length === originalDefinition.image.length && definition.image.length === 0){
                                    delete definition.image
                                }
                            }
                            // 判斷音檔是否有不同
                            if (definition.hasOwnProperty('voice')) {
                                
                                // 如果是移除音檔走這
                                if(definition.voice && definition.voice.length > 0 && definition.voice[0].file_name === 'remove'){
                                    definition.voice = {}
                                }

                                // 判斷是否有音檔
                                if(definition.voice && definition.voice.length === originalDefinition.voice.length) {
                                    // 如果有音檔
                                    let allVoiceFileNamesMatch = true;

                                    if(definition.voice[0] && originalDefinition.voice[0]){
                                        if (definition.voice[0].file_name !== originalDefinition.voice[0].file_name) {
                                            allVoiceFileNamesMatch = false;
                                        }
                                    }
                                    if (allVoiceFileNamesMatch) {
                                        delete definition.voice;
                                    }
                                }else if(definition.voice && definition.voice.length === originalDefinition.voice.length && definition.voice.length === 0){
                                    // 如果沒有音檔
                                    delete definition.voice;
                                }
                            }
                            // 判斷英譯
                            if(definition.trans.definitionText_en === originalDefinition.trans.definitionText_en){
                                delete definition.trans
                            }
                            // 如果根本來的值一樣
                            let pinyin = ''
                            for (const key in definition) {
                                if(key === 'pinyin'){
                                    pinyin = definition[key]
                                }
                                if (definition[key] === originalDefinition[key]) {
                                    delete definition[key];
                                }
                            }
                            // 如果只是修改注音，要連同拼音一起送
                            if(definition.zhuyin && definition.zhuyin !== ''){
                                definition.pinyin = pinyin
                                definition.pinyinChecked = pinyin
                            }
                            if(definition.synonyms && definition.synonyms.length === 0){
                                delete definition.synonyms
                            }
                            if(definition.antonyms && definition.antonyms.length === 0){
                                delete definition.antonyms
                            }
                            // 移除空值
                            for (const key in definition) {
                                if (definition[key] === '' && key !== 'editDefinitionId' && key !== 'voice') {
                                    delete definition[key];
                                }
                            }
                        }
                    }else{
                        // 如果只是單純把釋義換位置
                        const hasEditDefinition = j.find(i => i.editDefinitionId === definition.editDefinitionId)
                        if(hasEditDefinition){
                            if(definition.sequence !== hasEditDefinition.definitionSequence){
                                let originalDefinition = null
                                originalDefinition = {
                                    classification: hasEditDefinition.classifyName,
                                    level: hasEditDefinition.level,
                                    definitionText: hasEditDefinition.definitionText,
                                    trans: {
                                        definitionText_en: hasEditDefinition.definitionTranslated,
                                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                                    },
                                    pinyin: hasEditDefinition.pronunDetails.pinyin,
                                    zhuyin: hasEditDefinition.pronunDetails.zhuyin,
                                    exampleSentence: hasEditDefinition.exampleSentence,
                                    collocation: hasEditDefinition.collocation,
                                    partOfSpeech: hasEditDefinition.partOfSpeechName,
                                    synonyms: this.combineSynonyms(hasEditDefinition.synonyms),
                                    antonyms: this.combineSynonyms(hasEditDefinition.antonyms),
                                    image: hasEditDefinition.imageFiles,
                                    voice: hasEditDefinition.voiceFiles
                                }
                                if (definition.hasOwnProperty('image')) {
                                
                                    if (definition.image && definition.image.length === originalDefinition.image.length) {
                                        let allImageFileNamesMatch = true;
                                        for (let i = 0; i < definition.image.length; i++) {
                                            if (definition.image[i].file_name !== originalDefinition.image[i].originalFileName) {
                                                allImageFileNamesMatch = false;
                                                break;
                                            }
                                        }
                                        if (allImageFileNamesMatch) {
                                            delete definition.image;
                                        }
                                    }else if(definition.image && definition.image.length === originalDefinition.image.length && definition.image.length === 0){
                                        delete definition.image
                                    }
                                }
                                // 判斷音檔是否有不同
                                if (definition.hasOwnProperty('voice')) {
                                    
                                    // 如果是移除音檔走這
                                    if(definition.voice && definition.voice.length > 0 && definition.voice[0].file_name === 'remove'){
                                        definition.voice = {}
                                    }

                                    // 判斷是否有音檔
                                    if(definition.voice && definition.voice.length === originalDefinition.voice.length) {
                                        // 如果有音檔
                                        let allVoiceFileNamesMatch = true;

                                        if(definition.voice[0] && originalDefinition.voice[0]){
                                            if (definition.voice[0].file_name !== originalDefinition.voice[0].file_name) {
                                                allVoiceFileNamesMatch = false;
                                            }
                                        }
                                        if (allVoiceFileNamesMatch) {
                                            delete definition.voice;
                                        }
                                    }else if(definition.voice && definition.voice.length === originalDefinition.voice.length && definition.voice.length === 0){
                                        // 如果沒有音檔
                                        delete definition.voice;
                                    }
                                }
                                // 判斷英譯
                                if(definition.trans.definitionText_en === originalDefinition.trans.definitionText_en){
                                    delete definition.trans
                                }
                                // 如果根本來的值一樣
                                let pinyin = ''
                                for (const key in definition) {
                                    if(key === 'pinyin'){
                                        pinyin = definition[key]
                                    }
                                    if (definition[key] === originalDefinition[key]) {
                                        delete definition[key];
                                    }
                                }

                                // 如果只是修改注音，要連同拼音一起送
                                if(definition.zhuyin && definition.zhuyin !== ''){
                                    definition.pinyin = pinyin
                                    definition.pinyinChecked = pinyin
                                }
                                if(definition.synonyms && definition.synonyms.length === 0){
                                    delete definition.synonyms
                                }
                                if(definition.antonyms && definition.antonyms.length === 0){
                                    delete definition.antonyms
                                }
                                // 移除空值
                                for (const key in definition) {
                                    if (definition[key] === '' && key !== 'editDefinitionId' && key !== 'voice') {
                                        delete definition[key];
                                    }
                                }

                                // 判斷是否變換位置後有更新
                                const keys = Object.keys(definition);
                                const allowedKeys = ['editDefinitionId', 'sequence', 'action'];

                                // 检查是否有除了指定键以外的其他键存在
                                const hasExtraKeys = keys.some(key => !allowedKeys.includes(key));

                                if (hasExtraKeys) {
                                    definition.action = 'update';
                                } else {
                                    definition.action = '';
                                }
                            }
                        }
                    }
                }

                // 新增的情況，且屬性是空值，就不送
                if(definition.action === 'create'){

                    if(definition.trans.definitionText_en === ''){
                        delete definition.trans
                    }
                    if(definition.image && definition.image.length === 0){
                        delete definition.image
                    }
                    if(definition.voice && definition.voice.length === 0){
                        delete definition.voice
                    }
                    if(definition.synonyms && definition.synonyms.length === 0){
                            delete definition.synonyms
                        }
                    if(definition.antonyms && definition.antonyms.length === 0){
                        delete definition.antonyms
                    }
                    let pinyin = ''
                    for (const key in definition) {
                        if(key === 'pinyin'){
                            pinyin = definition[key]
                        }
                        if (definition[key] === '' && key !== 'editDefinitionId') {
                            delete definition[key];
                        }
                    }
                    // 如果只是修改注音，要連同拼音一起送
                    if(definition.zhuyin && definition.zhuyin !== ''){
                        definition.pinyin = pinyin
                        definition.pinyinChecked = pinyin
                    }
                }
                wordData.definitions.push(definition);
            })

            // 確認有沒有刪除的釋義
            const unMatchItem = []
            j.forEach(i => {
                const hasEditDefinition = wordData.definitions.find(item => item.editDefinitionId === i.editDefinitionId)
                if(!hasEditDefinition){
                    unMatchItem.push(i)
                }
            
            })
            this.loading = false
            
            if(unMatchItem.length > 0){
                unMatchItem.forEach(item => {

                    // 這邊是要撇除掉新增的釋義
                    if(item.editDefinitionId){
                        const unMatchDataItem = {
                            action: 'delete',
                            editDefinitionId: item.editDefinitionId,
                        }
                        wordData.definitions.push(unMatchDataItem)
                    }
                })
            }
            editSrv.saveEdit(wordData).then((res) => {
                this.loading = false
                if(res.data.rtnCode === '0000'){
                    if(this.editData.length > 1){
                        Swal.fire({
                            toast: true,
                            position: 'center',
                            title: `${res.data.rtnMsg}`,
                            confirmButtonColor: '#0E2A34',
                            confirmButtonText: '確認',
                            background: '#F0F0F2',
                            width: 400
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.editData.splice(this.currentItem, 1);
                                this.tab = this.editData[0]
                            }
                        });
                    }else if(this.editData.length === 1){
                        Swal.fire({
                            toast: true,
                            position: 'center',
                            title: `${res.data.rtnMsg}`,
                            confirmButtonColor: '#0E2A34',
                            confirmButtonText: '確認',
                            background: '#F0F0F2',
                            width: 400
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.$router.push({ 
                                    path: '/admin/DataEdit', 
                                    query: { action: 'reset' } 
                                });
                            }
                        });
                    }
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
            })
        },
        saveAndSubmit(){
            this.loading = true
            const editData = this.editData[this.currentItem]
            const wordTextInfo = JSON.parse(localStorage.getItem('editData'))
            const j = wordTextInfo ? wordTextInfo.editDefinitions : null
            const wordData = {
                action: j ? 'update' : 'create',
                wordId: editData.wordId || '',
                wordName: editData.wordText,
                definitions:[]
            }
            if(j){
                editData.editDefinitions.forEach((i, index) => {
                let definition = {
                    editDefinitionId: i.editDefinitionId || '',
                    action: i.editDefinitionId ? 'update' : 'create',
                    sequence: index + 1,
                    classification: i.classification,
                    level: i.level,
                    definitionText: i.definitionText,
                    trans: {
                        definitionText_en: i.definitionTranslated,
                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                    },
                    pinyin: i.pronunDetails.pinyin,
                    zhuyin: i.pronunDetails.zhuyin,
                    exampleSentence: i.exampleSentence || '',
                    collocation: i.collocation || '',
                    partOfSpeech: i.partOfSpeechName,
                    synonyms: i.synonyms || [],
                    antonyms: i.antonyms || [],
                    image: this.tidyImage(i.imageFiles),
                    voice: i.voiceTemp
                }
                if(typeof definition.zhuyin === 'object'){
                    definition.zhuyin = definition.zhuyin.join(' ')
                }
                // 更新內容
                if(i.editDefinitionId && j[index].editDefinitionId){
                    if(i.editDefinitionId === j[index].editDefinitionId){
                    
                        if(definition.action === 'update'){
                            let originalDefinition = null
                            originalDefinition = {
                                classification: j[index].classifyName,
                                level: j[index].level,
                                definitionText: j[index].definitionText,
                                trans: {
                                    definitionText_en: j[index].definitionTranslated,
                                    language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                                },
                                pinyin: j[index].pronunDetails.pinyin,
                                zhuyin: j[index].pronunDetails.zhuyin,
                                exampleSentence: j[index].exampleSentence,
                                collocation: j[index].collocation,
                                partOfSpeech: j[index].partOfSpeechName,
                                synonyms: this.combineSynonyms(j[index].synonyms),
                                antonyms: this.combineSynonyms(j[index].antonyms),
                                image: j[index].imageFiles,
                                voice: j[index].voiceFiles
                            }
                            // 判斷圖片是否有不同
                            if (definition.hasOwnProperty('image')) {
                                
                                if (definition.image && definition.image.length === originalDefinition.image.length) {
                                    let allImageFileNamesMatch = true;
                                    for (let i = 0; i < definition.image.length; i++) {
                                        if (definition.image[i].file_name !== originalDefinition.image[i].originalFileName) {
                                            allImageFileNamesMatch = false;
                                            break;
                                        }
                                    }
                                    if (allImageFileNamesMatch) {
                                        delete definition.image;
                                    }
                                }else if(definition.image && definition.image.length === originalDefinition.image.length && definition.image.length === 0){
                                    delete definition.image
                                }
                            }
                            // 判斷音檔是否有不同
                            if (definition.hasOwnProperty('voice')) {
                                
                                // 如果是移除音檔走這
                                if(definition.voice && definition.voice.length > 0 && definition.voice[0].file_name === 'remove'){
                                    definition.voice = {}
                                }

                                // 判斷是否有音檔
                                if(definition.voice && definition.voice.length === originalDefinition.voice.length) {
                                    // 如果有音檔
                                    let allVoiceFileNamesMatch = true;

                                    if(definition.voice[0] && originalDefinition.voice[0]){
                                        if (definition.voice[0].file_name !== originalDefinition.voice[0].file_name) {
                                            allVoiceFileNamesMatch = false;
                                        }
                                    }
                                    if (allVoiceFileNamesMatch) {
                                        delete definition.voice;
                                    }
                                }else if(definition.voice && definition.voice.length === originalDefinition.voice.length && definition.voice.length === 0){
                                    // 如果沒有音檔
                                    delete definition.voice;
                                }
                            }
                            // 判斷英譯
                            if(definition.trans.definitionText_en === originalDefinition.trans.definitionText_en){
                                delete definition.trans
                            }
                            // 如果根本來的值一樣
                            let pinyin = ''
                            for (const key in definition) {
                                if(key === 'pinyin'){
                                    pinyin = definition[key]
                                }
                                if (definition[key] === originalDefinition[key]) {
                                    delete definition[key];
                                }
                            }

                            // 如果只是修改注音，要連同拼音一起送
                            if(definition.zhuyin && definition.zhuyin !== ''){
                                definition.pinyin = pinyin
                                definition.pinyinChecked = pinyin
                            }
                            if(definition.synonyms && definition.synonyms.length === 0){
                                delete definition.synonyms
                            }
                            if(definition.antonyms && definition.antonyms.length === 0){
                                delete definition.antonyms
                            }
                            // 移除空值
                            for (const key in definition) {
                                if (definition[key] === '' && key !== 'editDefinitionId' && key !== 'voice') {
                                    delete definition[key];
                                }
                            }
                        }
                    }else{
                        // 如果只是單純把釋義換位置
                        const hasEditDefinition = j.find(i => i.editDefinitionId === definition.editDefinitionId)
                        if(hasEditDefinition){
                            if(definition.sequence !== hasEditDefinition.definitionSequence){
                                let originalDefinition = null
                                originalDefinition = {
                                    classification: hasEditDefinition.classifyName,
                                    level: hasEditDefinition.level,
                                    definitionText: hasEditDefinition.definitionText,
                                    trans: {
                                        definitionText_en: hasEditDefinition.definitionTranslated,
                                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                                    },
                                    pinyin: hasEditDefinition.pronunDetails.pinyin,
                                    zhuyin: hasEditDefinition.pronunDetails.zhuyin,
                                    exampleSentence: hasEditDefinition.exampleSentence,
                                    collocation: hasEditDefinition.collocation,
                                    partOfSpeech: hasEditDefinition.partOfSpeechName,
                                    synonyms: this.combineSynonyms(hasEditDefinition.synonyms),
                                    antonyms: this.combineSynonyms(hasEditDefinition.antonyms),
                                    image: hasEditDefinition.imageFiles,
                                    voice: hasEditDefinition.voiceFiles
                                }
                                if (definition.hasOwnProperty('image')) {
                                
                                    if (definition.image && definition.image.length === originalDefinition.image.length) {
                                        let allImageFileNamesMatch = true;
                                        for (let i = 0; i < definition.image.length; i++) {
                                            if (definition.image[i].file_name !== originalDefinition.image[i].originalFileName) {
                                                allImageFileNamesMatch = false;
                                                break;
                                            }
                                        }
                                        if (allImageFileNamesMatch) {
                                            delete definition.image;
                                        }
                                    }else if(definition.image && definition.image.length === originalDefinition.image.length && definition.image.length === 0){
                                        delete definition.image
                                    }
                                }
                                // 判斷音檔是否有不同
                                if (definition.hasOwnProperty('voice')) {
                                    
                                    // 如果是移除音檔走這
                                    if(definition.voice && definition.voice.length > 0 && definition.voice[0].file_name === 'remove'){
                                        definition.voice = {}
                                    }

                                    // 判斷是否有音檔
                                    if(definition.voice && definition.voice.length === originalDefinition.voice.length) {
                                        // 如果有音檔
                                        let allVoiceFileNamesMatch = true;

                                        if(definition.voice[0] && originalDefinition.voice[0]){
                                            if (definition.voice[0].file_name !== originalDefinition.voice[0].file_name) {
                                                allVoiceFileNamesMatch = false;
                                            }
                                        }
                                        if (allVoiceFileNamesMatch) {
                                            delete definition.voice;
                                        }
                                    }else if(definition.voice && definition.voice.length === originalDefinition.voice.length && definition.voice.length === 0){
                                        // 如果沒有音檔
                                        delete definition.voice;
                                    }
                                }
                                // 判斷英譯
                                if(definition.trans.definitionText_en === originalDefinition.trans.definitionText_en){
                                    delete definition.trans
                                }
                                // 如果根本來的值一樣
                                let pinyin = ''
                                for (const key in definition) {
                                    if(key === 'pinyin'){
                                        pinyin = definition[key]
                                    }
                                    if (definition[key] === originalDefinition[key]) {
                                        delete definition[key];
                                    }
                                }

                                // 如果只是修改注音，要連同拼音一起送
                                if(definition.zhuyin && definition.zhuyin !== ''){
                                    definition.pinyin = pinyin
                                    definition.pinyinChecked = pinyin
                                }
                                if(definition.synonyms && definition.synonyms.length === 0){
                                    delete definition.synonyms
                                }
                                if(definition.antonyms && definition.antonyms.length === 0){
                                    delete definition.antonyms
                                }
                                // 移除空值
                                for (const key in definition) {
                                    if (definition[key] === '' && key !== 'editDefinitionId' && key !== 'voice') {
                                        delete definition[key];
                                    }
                                }

                                // 判斷是否變換位置後有更新
                                const keys = Object.keys(definition);
                                const allowedKeys = ['editDefinitionId', 'sequence', 'action'];

                                // 检查是否有除了指定键以外的其他键存在
                                const hasExtraKeys = keys.some(key => !allowedKeys.includes(key));

                                if (hasExtraKeys) {
                                    definition.action = 'update';
                                } else {
                                    definition.action = '';
                                }
                            }
                        }
                    }
                }

                // 新增的情況，且屬性是空值，就不送
                if(definition.action === 'create'){

                    if(definition.trans.definitionText_en === ''){
                        delete definition.trans
                    }
                    if(definition.image && definition.image.length === 0){
                        delete definition.image
                    }
                    if(definition.voice && definition.voice.length === 0){
                        delete definition.voice
                    }
                    if(definition.synonyms && definition.synonyms.length === 0){
                            delete definition.synonyms
                        }
                    if(definition.antonyms && definition.antonyms.length === 0){
                        delete definition.antonyms
                    }
                    let pinyin = ''
                    for (const key in definition) {
                        if(key === 'pinyin'){
                            pinyin = definition[key]
                        }
                        if (definition[key] === '' && key !== 'editDefinitionId') {
                            delete definition[key];
                        }
                    }
                    // 如果只是修改注音，要連同拼音一起送
                    if(definition.zhuyin && definition.zhuyin !== ''){
                        definition.pinyin = pinyin
                        definition.pinyinChecked = pinyin
                    }
                }
                wordData.definitions.push(definition);
            })

            // 確認有沒有刪除的釋義
            const unMatchItem = []
            j.forEach(i => {
                const hasEditDefinition = wordData.definitions.find(item => item.editDefinitionId === i.editDefinitionId)
                if(!hasEditDefinition){
                    unMatchItem.push(i)
                }
            })
            
            if(unMatchItem.length > 0){
                unMatchItem.forEach(item => {

                    // 這邊是要撇除掉新增的釋義
                    if(item.editDefinitionId){
                        const unMatchDataItem = {
                            action: 'delete',
                            editDefinitionId: item.editDefinitionId,
                        }
                        wordData.definitions.push(unMatchDataItem)
                    }
                })
            }
            }else{
                editData.editDefinitions.forEach((i, index) => {
                const definition = {
                    editDefinitionId: i.editDefinitionId || '',
                    action: 'create',
                    sequence: index + 1,
                    classification: i.classification  || '',
                    level: i.level  || '',
                    definitionText: i.definitionText  || '',
                    trans: {
                        definitionText_en: i.definitionTranslated  || '',
                        language_id: 'e3d5db85-846d-48b2-aef4-6e0c8d68c2a1'
                    },
                    pinyin: i.pronunDetails.pinyin  || '',
                    zhuyin: i.pronunDetails.zhuyin  || '',
                    exampleSentence: i.exampleSentence  || '',
                    collocation: i.collocation  || '',
                    partOfSpeech: i.partOfSpeechName  || '',
                    synonyms: i.synonyms  || '',
                    antonyms: i.antonyms  || '',
                    image: i.imageFiles,
                    voice: []
                }
                if(typeof definition.zhuyin === 'object'){
                    definition.zhuyin = definition.zhuyin.join(' ')
                }
                if(i.voiceTemp){
                    // definition.voice.push(i.voiceTemp)
                    definition.voice = i.voiceTemp
                }

                if(definition.trans.definitionText_en === ''){
                    delete definition.trans
                }
                if(definition.image.length === 0){
                    delete definition.image
                }
                if(definition.voice.length === 0){
                    delete definition.voice
                }
                for (const key in definition) {
                    if (definition[key] === '' && key !== 'editDefinitionId') {
                        delete definition[key];
                    }
                }
                if(definition.zhuyin && definition.zhuyin !== ''){
                    definition.pinyinChecked = definition.pinyin
                }
                wordData.definitions.push(definition)
            })
            }
            
            editSrv.saveAndSubmit(wordData).then((res) => {
                this.loading = false
                if(res.data.rtnCode === '0000'){
                    if(this.editData.length > 1){
                        Swal.fire({
                            toast: true,
                            position: 'center',
                            title: `${res.data.rtnMsg}`,
                            confirmButtonColor: '#0E2A34',
                            confirmButtonText: '確認',
                            background: '#F0F0F2',
                            width: 400
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.editData.splice(this.currentItem, 1);
                                this.tab = this.editData[0]
                            }
                        });
                    }else if(this.editData.length === 1){
                        Swal.fire({
                            toast: true,
                            position: 'center',
                            title: `${res.data.rtnMsg}`,
                            confirmButtonColor: '#0E2A34',
                            confirmButtonText: '確認',
                            background: '#F0F0F2',
                            width: 400
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.$router.push({ 
                                    path: '/admin/DataEdit', 
                                    query: { action: 'reset' } 
                                });
                            }
                        });
                    }
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.data.rtnMsg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
            })
        },
        preview(){
            const wordData = JSON.stringify(this.tab)
            localStorage.setItem('wordTextInfo', wordData)
            localStorage.setItem('path', 'edit');
            this.$router.push('/admin/WordDetail/123')
        },
        updateEditdata(obj, index){
            this.editData[index] = obj
        },
        combineSynonyms(item) {
            const wordsArray = item.map(i => i.wordText);
            const combinedString = wordsArray.join(', ');
            return combinedString;
        },
        tidyImage(item) {
            return item.map(element => {
                if (!element.hasOwnProperty('file_name')) {
                    const imageItem = {
                        file_name: element.originalFileName
                    };
                    delete element.base64;
                    delete element.originalFileName;
                    delete element.realFileName;
                    return imageItem;
                }else{
                    return element
                }
            });
        },
        validation(val){
            this.validate = val
        },
        setCurrentItem(index){
            this.currentItem = index
        }
    }
}

</script>
<style lang="scss" scoped>
.vh-100{
    min-height: calc(100vh - 48px);
}
</style>
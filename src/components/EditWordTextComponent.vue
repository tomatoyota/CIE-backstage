<template>
    <v-form v-model="validate">
        <v-row>
            <v-col cols="3" v-if="wordDetail">
                <v-text-field v-model="wordDetail.wordText" variant="outlined" :rules="chineseOnly">
                    <template #label>
                        <span class="red--text"><strong>*</strong></span>字詞名
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="3">
                <v-select v-model="selectedClassification" variant="outlined" :items="classification" item-title="name" item-value="name" :rules="selectRule">
                    <template #label>
                        <span class="red--text"><strong>*</strong></span>類別
                    </template>
                </v-select>
            </v-col>
        </v-row>
    
        <template v-if="wordDetail && wordDetail.editDefinitions">
            <div class="wordDetail mt-4" v-for="(item, index) in wordDetail.editDefinitions" :key="index">
                <v-row>
                    <v-col>
                        <p>釋義 {{ index + 1 }}</p>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <v-btn
                        flat
                        color="rgba(0,0,0,0)"
                        @click="moveDefinitions('up', item)"
                        >
                            <v-icon
                            icon="mdi mdi-chevron-up"
                            size="x-large"
                            ></v-icon>
                        </v-btn>
                        <v-btn
                        flat
                        color="rgba(0,0,0,0)"
                        @click="moveDefinitions('down', item)"
                        >
                            <v-icon
                            icon="mdi mdi-chevron-down"
                            size="x-large"
                            ></v-icon>
                        </v-btn>
                        <v-btn
                        flat
                        color="rgba(0,0,0,0)"
                        @click="removeDefinitionDialog(item)"
                        >
                            <v-icon
                            icon="mdi mdi-delete-outline"
                            size="x-large"
                            ></v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <v-text-field v-model="item.definitionText" :rules="textFieldRule" variant="outlined" label="釋義"  bg-color="white">
                            <template #label>
                                <span class="red--text"><strong>*</strong></span>釋義
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="3" class="position-relative">
                        <v-text-field :id="`pinyinField${item.sequence}`" v-model="item.pronunDetails.pinyin" @change="transformPinyin(item)" hint="請在字跟字之間加上逗號或空白" :persistent-hint="true" variant="outlined" label="漢語拼音"  bg-color="white" append-inner-icon="mdi mdi-keyboard-outline" @click:append-inner="togglePinyinKeyboard(item.sequence)"></v-text-field>
                        <pinyinKeyboard v-if="showPinyinKeyboard[item.sequence]" @text-updated="joinPinyin" @close-keyboard="closePinyinKeyboard(item.sequence)" :originalPinyin="originalPinyin"></pinyinKeyboard>
                    </v-col>
                    <v-col cols="3" class="position-relative">
                        <v-text-field :id="`zhuyinField${item.sequence}`" v-model="item.pronunDetails.zhuyin" @change="transformZhuyin(item)" hint="請在字跟字之間加上逗號或空白" :persistent-hint="true" @input="zhuyinInput" variant="outlined" label="注音"  bg-color="white" append-inner-icon="mdi mdi-keyboard-outline" @click:append-inner="toggleZhuyinKeyboard(item.sequence)"></v-text-field>
                        <zhuyinKeyboard v-if="showZhuyinKeyboard[item.sequence]" @text-updated="joinZhuyin" @close-keyboard="closeZhuyinKeyboard(item.sequence)" :originalZhuyin="originalZhuyin"></zhuyinKeyboard>
                    </v-col>
                    <v-col cols="3">
                        <v-file-input
                        v-model="item.voiceFiles"
                        label="字詞音檔"
                        variant="outlined"
                        bg-color="white"
                        @change="uploadVoice(index)"
                        @click:appendInner="removeVoice($event, index)"
                        append-inner-icon="mdi mdi-close"
                        accept="audio/mpeg,audio/wav"
                        hint="檔案大小限制為 4MB"
                        :persistent-hint="true"
                        max-size="4194304"
                        :clearable="false"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field v-model="item.definitionTranslated" variant="outlined" label="英文釋義"  bg-color="white"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-select v-model="item.level" variant="outlined" :rules="textFieldRule" :items="wordLevels" item-title="levelName" item-value="levelId" bg-color="white">
                            <template #label>
                                <span class="red--text"><strong>*</strong></span>等級
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <!-- <v-text-field v-model="item.exampleSentence" variant="outlined" label="例句"  bg-color="white"></v-text-field> -->
                        <v-textarea v-model="item.exampleSentence" variant="outlined" label="例句" rows="2" bg-color="white"></v-textarea>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="item.collocation" variant="outlined" label="用法 - 搭配詞"  bg-color="white"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="item.partOfSpeechName" :rules="textFieldRule" variant="outlined" label="詞性"  bg-color="white">
                            <template #label>
                                <span class="red--text"><strong>*</strong></span>詞性
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="item.synonyms" variant="outlined" label="近義詞"  bg-color="white"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="item.antonyms" variant="outlined" label="反義詞"  bg-color="white"></v-text-field>
                    </v-col>
                </v-row>
                <v-row class="border-top">
                    <label class="w-100 pl-4">附圖</label>
                    <v-col v-for="(imageItem, imageIndex) in item.imagePreview" :key="imageIndex" cols="2" class="position-relative images">
                        <div class="iconGroup">
                            <v-icon icon="mdi mdi-upload" bg-color="white" @click="renewImage(imageIndex, index, item)"></v-icon>
                            <v-icon icon="mdi mdi-trash-can" @click="imageDialog(imageIndex, index)"></v-icon>
                        </div>
                        <v-img :src="imageItem.image"></v-img>
                        <p>{{ imageItem.name }}</p>
                        <v-file-input :id="'renewImage' + index + imageIndex" class="d-none" multiple @change="updateImage(imageIndex, index)" accept="image/jpeg,image/png,image/gif"></v-file-input>
                    </v-col>
                    <v-col cols="2" class="justify-center d-flex">
                        <v-btn flat size="150px" class="imageAdd" color="#EFEFEF" @click="openInput(item, index)">
                            <v-icon icon="mdi mdi-plus" size="40px" color="#9C9C9C"></v-icon>
                        </v-btn>
                        <v-file-input :id="'fileInput' + index" class="d-none" multiple @change="tidyFile(item,'image', index)" accept="image/jpeg,image/png,image/gif"></v-file-input>
                    </v-col>
                </v-row>
            </div>
        </template>
    </v-form>
    <v-btn
    class="w-100 mt-8 addDefinition"
    height="60"
    flat
    @click="addDefinition()"
    >
        <v-icon
        icon="mdi mdi-plus"
        size="40"
        ></v-icon>
        新增釋義
    </v-btn>

    <v-dialog v-model="removeDialog" width="600px">
        <removeDefinitionComponent :removeDefinitionItem="removeDefinitionItem" @close-dialog="removeDialog = false" @remove-definition="removeDefinition"></removeDefinitionComponent>
    </v-dialog>

    <v-dialog v-model="removeImageDialog" width="600px">
        <removeImageComponent :index="imageIndex" @close-dialog="removeImageDialog = false" @removeImage="removeImage"></removeImageComponent>
    </v-dialog>
    <LoadingComponent :loading="loading"/>
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import pinyinKeyboard from '@/components/PinyinComponent.vue';
import zhuyinKeyboard from '@/components/ZhuyinComponent.vue';
import removeDefinitionComponent from '@/components/database/removeDefinitionComponent.vue';
import removeImageComponent from '@/components/database/removeImageComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import editSrv from '@/service/dataEdit.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { fromPinyin, toPinyin } from 'zhuyin-improved';
import * as utils from 'pinyin-utils';

export default {
    emits: ['updateData', 'validation'],
    props:{
        editDataDetail: Object,
        selectItem: Object,
        index: Number
    },
    components:{
        pinyinKeyboard,
        zhuyinKeyboard,
        removeDefinitionComponent,
        removeImageComponent,
        LoadingComponent,
    },
    data() {
        return {
            wordDetail: null,
            showPinyinKeyboard: [],
            showZhuyinKeyboard: [],
            currentPinyin: '',
            currentZhuyin: '',
            classification: [],
            wordLevels: [],
            selectedClassification: null,
            synonyms:'',
            antonyms:'',
            removeDialog: false,
            removeDefinitionItem: null,
            textFieldRule: [
                (v) => !!v || '此欄位為必填',
            ],
            selectRule: [
                (v) => !!v || '此欄位為必填',
            ],
            chineseOnly: [
                (v) => !!v || '此欄位不得為空',
                (v) => /^[\u4e00-\u9fa5]+$/.test(v) || '只能輸入中文字'
            ],
            imageItems:[],
            renewImageIndex: null,
            imageIndex: null,
            removeImageDialog: false,
            currentItem: null,
            validate: false,
            loading: false,
            keyboardPinyin: '',
            keyboardZhuyin: '',
            originalPinyin: '',
            originalZhuyin: '',
        };
    },
    created(){
        const store = useEditdbStore();
        const { editStatus } = storeToRefs(store);
        const editDropdown = editStatus.value
        if(editDropdown){
            this.classification = editDropdown.classifications
            this.wordLevels = editDropdown.wordLevels
        }
    },
    mounted(){
        this.initData()
        window.addEventListener('click', this.handlePageClick);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.handlePageClick);
    },
    watch:{
        wordDetail: {
            handler(newValue) {
                this.$emit('updateData', newValue, this.index)
            },
            deep: true
        },
        selectedClassification(val){
            if(val){
                this.wordDetail.editDefinitions.forEach(i => {
                    i.classification = val
                })
            }
        },
        validate(val){
            this.$emit('validation', val)
        },
    },
    methods:{
        handlePageClick(event) {
            const targetId = event.target.id;
            const targetTag = event.target.tagName;
            
            if(targetTag === 'INPUT'){
                if(targetId.includes('pinyinField') || targetId.includes('zhuyinField')){
                    this.dynamicKeyboard(targetId)
                    return
                }else{
                    const currentDefinition = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentPinyin) || this.wordDetail.editDefinitions.find(d => d.sequence === this.currentZhuyin)
                    if(currentDefinition.pronunDetails.pinyin !== '' && currentDefinition.pronunDetails.zhuyin === ''){
                        this.transformPinyin(currentDefinition)
                    }else if (currentDefinition.pronunDetails.zhuyin !== '' && currentDefinition.pronunDetails.pinyin === '') {
                        this.transformZhuyin(currentDefinition)
                    }
                    this.showPinyinKeyboard.forEach((i, index) => {
                        this.showPinyinKeyboard[index] = false
                    })
                    this.showZhuyinKeyboard.forEach((i, index) => {
                        this.showZhuyinKeyboard[index] = false
                    })
                }
            }
        },
        dynamicKeyboard(id){
            const keyboardType = id.includes('pinyinField') ? 'Pinyin' : 'Zhuyin'
            const sequence = id.split('Field')[1]
            const currentDefinition = this.wordDetail.editDefinitions.find(d => d.sequence === parseInt(sequence))

            if(typeof this.currentPinyin === 'string'){
                this.currentPinyin = parseInt(this.currentPinyin)
            }
            
            if(typeof this.currentZhuyin === 'string'){
                this.currentZhuyin = parseInt(this.currentZhuyin)
            }
            if(keyboardType === 'Pinyin'){
                
                if(this.showPinyinKeyboard.includes(true)){
                    this.showPinyinKeyboard.forEach((i, index) => {
                        this.showPinyinKeyboard[index] = false
                    })        
                    this.showPinyinKeyboard[sequence] = true
                    this.currentPinyin = sequence
                    

                }else if(this.showZhuyinKeyboard.includes(true)){
                    this.showZhuyinKeyboard.forEach((i, index) => {
                        this.showZhuyinKeyboard[index] = false
                        this.showPinyinKeyboard[index] = false
                    })
                    
                    this.showPinyinKeyboard[sequence] = true
                    this.currentPinyin = sequence
                }
                if(/\d/.test(currentDefinition.pronunDetails.pinyin)){
                    this.transformZhuyin(currentDefinition)
                }
            }else{
                if(this.showZhuyinKeyboard.includes(true)){
                    this.showZhuyinKeyboard.forEach((i, index) => {
                        this.showZhuyinKeyboard[index] = false
                    })
                    this.showZhuyinKeyboard[sequence] = true
                    this.currentZhuyin = sequence
                }else if(this.showPinyinKeyboard.includes(true)){
                    this.showPinyinKeyboard.forEach((i, index) => {
                        this.showPinyinKeyboard[index] = false
                        this.showZhuyinKeyboard[index] = false
                    })
                    this.showZhuyinKeyboard[sequence] = true
                    this.currentZhuyin = sequence
                }
                this.transformPinyin(currentDefinition)
            }
        },
        transformPinyin(item) {
            if(item.pronunDetails.pinyin !== ''){
                this.loading = true;
                const pinyinText = item.pronunDetails.pinyin;
                const newZhuyin = fromPinyin(pinyinText);
                const newPinyin = utils.numberToMark(pinyinText);
                
                item.pronunDetails.zhuyin = newZhuyin;
                item.pronunDetails.pinyin = newPinyin;
                this.loading = false;
            }
        },
        transformZhuyin(item) {
            if(item.pronunDetails.zhuyin !== ''){
                this.loading = true;
                const pinyinText = item.pronunDetails.zhuyin;
                const newZhuyin = toPinyin(pinyinText);
                let newPinyin = '';
                newZhuyin.forEach(i => {
                    newPinyin += i + ' ';
                });
                newPinyin = newPinyin.trim();
                item.pronunDetails.pinyin = newPinyin;
                this.loading = false;
            }
        },
        closePinyinKeyboard(sequence){
            this.showPinyinKeyboard[sequence] = false;
            
            if(typeof this.currentPinyin === 'string'){
                this.currentPinyin = parseInt(this.currentPinyin)
            }
            
            const currentPinyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentPinyin)
            this.transformPinyin(currentPinyin)
        },
        closeZhuyinKeyboard(sequence){
            this.showZhuyinKeyboard[sequence] = false;

            if(typeof this.currentZhuyin === 'string'){
                this.currentZhuyin = parseInt(this.currentZhuyin)
            }

            const currentZhuyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentZhuyin)
            this.transformZhuyin(currentZhuyin)
        },
        initData(){
            this.editDataDetail.editDefinitions.forEach((i, index) => {
                i.sequence = i.definitionSequence || i.sequence;
                this.showPinyinKeyboard.push(false)
                this.showZhuyinKeyboard.push(false)
                if(i.synonyms && Array.isArray(i.synonyms) && i.synonyms.length > 0 ){
                    const synonymsArray = i.synonyms.map(i => i.wordText);
                    const mixSynonyms = synonymsArray.join(', ');
                    i.synonyms = mixSynonyms
                }
                
                if(i.antonyms && Array.isArray(i.antonyms) && i.antonyms.length > 0){
                    const antonymsArray = i.antonyms.map(i => i.wordText);
                    const mixAntonyms = antonymsArray.join(', ');
                    i.antonyms = mixAntonyms
                }

                i.imagePreview = []
                const formData = new FormData();
                if (i.imageFiles && i.imageFiles.length > 0) {
                    i.imageFiles.forEach(j => {
                        const byteCharacters = atob(j.base64);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        let type = 'image/' + j.originalFileName.split('.')[1]
                        if (type === 'image/jpg') {
                            type = 'image/jpeg';
                        }
                        const blob = new Blob([byteArray],  { type: type });
                        const imgUrl = URL.createObjectURL(blob);
                        const imageItem = {
                            image: imgUrl,
                            name: decodeURIComponent(j.originalFileName)
                        };
                        i.imagePreview.push(imageItem);
                        const imageFile = this.base64ToFile(j.base64, encodeURIComponent(j.originalFileName), type )
                        formData.append('media', imageFile)
                    });
                    this.uploadFile(formData, '')
                }

                if(i.voiceFiles && i.voiceFiles.length > 0){
                    i.voiceFiles.forEach(j => {
                        const byteCharacters = atob(j.base64);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        let type = 'audio/' + j.originalFileName.split('.')[1]
                        const blob = new Blob([byteArray],  { type: type });
                        const voiceUrl = URL.createObjectURL(blob);
                        const voiceItem = {
                            voice: voiceUrl,
                            name: decodeURIComponent(j.originalFileName)
                        };
                        i.voiceFiles = []
                        i.voiceFiles.push(voiceItem);
                        const voiceFile = this.base64ToFile(j.base64, decodeURIComponent(j.originalFileName), type )
                        formData.append('media', voiceFile)
                    });
                }
            })
            this.wordDetail = this.editDataDetail
            let selectedClassification = ''
            if(this.editDataDetail && this.editDataDetail.editDefinitions && this.editDataDetail.editDefinitions.length > 0){
                selectedClassification = this.editDataDetail.editDefinitions[0].classifyName
            }else{
                selectedClassification = null
            }
            this.selectedClassification = selectedClassification
        },
        togglePinyinKeyboard(value){
            if(this.showZhuyinKeyboard[value]){
                this.showZhuyinKeyboard[value] = false
            }
            this.showPinyinKeyboard[value] = !this.showPinyinKeyboard[value]
            this.currentPinyin = value
            const originalPinyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentPinyin)
            this.originalPinyin = originalPinyin.pronunDetails.pinyin
        },
        toggleZhuyinKeyboard(value){
            if(this.showPinyinKeyboard[value]){
                this.showPinyinKeyboard[value] = false
            }
            this.showZhuyinKeyboard[value] = !this.showZhuyinKeyboard[value]
            this.currentZhuyin = value
            const originalZhuyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentZhuyin)
            this.originalZhuyin = originalZhuyin.pronunDetails.zhuyin
        },
        openInput(item, index){
            this.currentItem = item
            const id = 'fileInput' + (index)
            document.getElementById(id).click();
        },
        joinPinyin(item){
            if(typeof this.currentPinyin === 'string'){
                this.currentPinyin = parseInt(this.currentPinyin)
            }
            const currentPinyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentPinyin)
            if(item === '清除'){
                currentPinyin.pronunDetails.pinyin = ''
            }else{
                currentPinyin.pronunDetails.pinyin = currentPinyin.pronunDetails.pinyin + item    
            }
        },
        joinZhuyin(item){
            if(typeof this.currentZhuyin === 'string'){
                this.currentZhuyin = parseInt(this.currentZhuyin)
            }
            const currentZhuyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentZhuyin)
            if(item === '清除'){
                currentZhuyin.pronunDetails.zhuyin = ''
            }else{
                currentZhuyin.pronunDetails.zhuyin = currentZhuyin.pronunDetails.zhuyin + item
            }
        },
        addDefinition(){
            const length = this.wordDetail.editDefinitions.length
            const editData = {
                sequence: length + 1,
                classification: this.selectedClassification,
                collocation:'',
                collocationTranslated:'',
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
            this.wordDetail.editDefinitions.push(editData)
        },
        removeDefinitionDialog(item){
            if(this.wordDetail.editDefinitions.length === 1){
                Swal.fire({
                    toast: true,
                    position: 'center',
                    icon: 'error',
                    title: `僅剩一組釋義，無法進行刪除`,
                    confirmButtonColor: '#0E2A34',
                    confirmButtonText: '確認',
                    background: '#F0F0F2',
                    width: 400
                });
            }else{
                this.removeDefinitionItem = item
                this.removeDialog = true;
            }
        },
        removeDefinition(item){
            const wordDetail = this.wordDetail.editDefinitions
            const matchDefinition = wordDetail.find(d => d.sequence === item.sequence)
            if(matchDefinition && wordDetail.length > 1){
                const indexOf = wordDetail.indexOf(matchDefinition)
                wordDetail.splice(indexOf, 1)
                let newIndex = 0
                wordDetail.forEach(d => {
                    d.sequence = newIndex 
                    newIndex++
                })
            }
        },
        moveDefinitions(direction, group){
            const definitions = this.wordDetail.editDefinitions
            const currentIndex = definitions.indexOf(group);
            if (direction === 'up' && currentIndex > 0) {
                const targetIndex = currentIndex - 1;
                definitions.splice(targetIndex, 0, definitions.splice(currentIndex, 1)[0]);
            } else if (direction === 'down' && currentIndex < definitions.length - 1) {
                const targetIndex = currentIndex + 1;
                definitions.splice(targetIndex, 0, definitions.splice(currentIndex, 1)[0]);
            }
        },
        async tidyFile(item, action, index) {
            const sequence = this.currentItem.sequence;
            const formData = new FormData();
            const id = 'fileInput' + index;
            const fileInput = document.getElementById(id);

            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                // 將檔案名編碼
                const encodedFileName = encodeURIComponent(file.name);
                // 使用編碼後的檔案名附加檔案
                formData.append('media', file, encodedFileName);

                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageItem = {
                        image: event.target.result,
                        name: decodeURIComponent(encodedFileName)
                    };
                    this.wordDetail.editDefinitions[index].imagePreview.push(imageItem);
                };
                reader.readAsDataURL(file);
            }
            this.uploadFile(formData, 'upload', index);
        },
        // 替換圖片
        renewImage(imageIndex, index, item){
            this.renewImageIndex = {imageIndex, index, item}
            const id = 'renewImage' + index + imageIndex
            document.getElementById(id).click();
        },
        updateImage(imageIndex, index) {
            this.currentItem = this.renewImageIndex.item
            const sequence = this.renewImageIndex.index
            const id = 'renewImage' + index + imageIndex
            const fileInput = document.getElementById(id);
            const formData = new FormData();
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageItem = {
                    image: event.target.result,
                    name: encodeURIComponent(file.name)
                }
                this.wordDetail.editDefinitions[sequence].imagePreview[this.renewImageIndex.imageIndex] = imageItem
            };
            reader.readAsDataURL(file);
            formData.append('media', file);
            this.uploadFile(formData, 'update', index)
        },
        // 刪除圖片
        imageDialog(imageIndex, index){
            this.removeImageDialog = true
            this.renewImageIndex = {imageIndex, index}
        },
        removeImage(){
            const formData = new FormData();
            const sequence = this.renewImageIndex.index
            const index = this.renewImageIndex.imageIndex
            this.wordDetail.editDefinitions[sequence].imageFiles.splice(index, 1)
            this.wordDetail.editDefinitions[sequence].imagePreview.splice(index, 1)
            this.currentItem = this.wordDetail.editDefinitions[sequence]
            
            this.wordDetail.editDefinitions[sequence].imageFiles.forEach(j => {
                const byteCharacters = atob(j.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                let type = 'image/' + j.originalFileName.split('.')[1]
                if (type === 'image/jpg') {
                    type = 'image/jpeg';
                }
                const blob = new Blob([byteArray],  { type: type });
                const imgUrl = URL.createObjectURL(blob);
                const imageItem = {
                    image: imgUrl,
                    name: j.originalFileName
                };
                const imageFile = this.base64ToFile(j.base64, j.originalFileName, type )
                formData.append('media', imageFile)
            });
            this.uploadFile(formData, 'remove')
            this.renewImageIndex = index
        },
        // 上傳檔案
        uploadFile(formData, action, index){

            let sequence = null
            if(this.currentItem !== null){
                sequence = this.currentItem.sequence
            }
            this.loading = true
            editSrv.uploadFile(formData).then((res) => {
                const files = res.data.files
                this.loading = false
                if(action === 'upload'){
                    // 新增
                    files.forEach(i => {
                        const imageItem = {
                            file_name: i.originalname,
                        }
                        if(index){
                            this.wordDetail.editDefinitions[index].imageFiles.push(imageItem)
                        }else{
                            this.wordDetail.editDefinitions[index].imageFiles.push(imageItem)
                        }
                    })
                }else if(action === 'update'){
                    // 更新
                    const imageItem = {
                        file_name: files[0].originalname
                    }
                    this.wordDetail.editDefinitions[sequence - 1].imageFiles[this.renewImageIndex.imageIndex] = imageItem
                }else if(action === 'remove'){
                    // 刪除
                    this.wordDetail.editDefinitions[sequence - 1].imageFiles = []
                    this.wordDetail.editDefinitions[sequence - 1].imagePreview = []
                    files.forEach(i => {
                        const imageItem = {
                            file_name: i.originalname,
                        }
                        this.wordDetail.editDefinitions[sequence - 1].imageFiles.push(imageItem)
                        this.wordDetail.editDefinitions[sequence - 1].imagePreview.push(imageItem)
                    })
                }
            })
        },
        uploadVoice(index){
            this.loading = true;
            const file = event.target.files[0];
            let formData = new FormData();
            // 將檔案名編碼
            const encodedFileName = encodeURIComponent(file.name);
            // 使用編碼後的檔案名附加檔案
            formData.append('media', file, encodedFileName);
            this.loading = true;
            
            editSrv.uploadFile(formData).then((res) => {
                this.loading = false;
                const voiceItem = [{
                    file_name: res.data.files[0].filename,
                    file_type: 1,
                }];
                this.wordDetail.editDefinitions[index].voiceTemp = voiceItem;
            });
        },
        removeVoice(event, index) {
            event.stopPropagation();
            event.preventDefault();
            const voiceItem = {
                    file_name: 'remove',
                }
            this.wordDetail.editDefinitions[index].voiceTemp = [{file_name: 'remove'}]
            this.wordDetail.editDefinitions[index].voiceFiles = [{file_name: 'remove'}]
        },
        base64ToFile(base64String, fileName, mimeType) {
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            // 创建File对象
            const file = new File([blob], fileName, { type: mimeType });
            return file;
        },
        zhuyinInput(event) {
            const inputChar = event.data;
            const zhuyinRegex = /[\u3105-\u3129\u02D9]/;
            if (inputChar && !zhuyinRegex.test(inputChar)) {
                return
            }
        },
    },
}
</script>

<style scoped lang="scss">
    .wordDetail{
        background-color: #F8F8F8;
        padding: 15px;
        border-radius: 4px;
        border: 1px solid #AEAEAE;
    }
    .addDefinition{
        background-color: #EBEBEB;
    }
    .iconGroup{
        position: absolute;
        z-index: 1;
        right: 5px;
        top: 5px;
        i{
            background-color: white;
            border-radius: 100px;
        }
    }
    .images{
        .v-img{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 150px
        }
        p{
            flex-basis: 100%;
            width: 100%;
            word-break: break-all;
            margin-top: 15px;
        }
    }
    .border-top{
        border-top: 1px solid #CACACA;
        padding-top: 15px;
    }
    .red--text{
        color: red;
    }
    .transformPinyinBtn{
        position: absolute;
        top: -20px;
        right: 10px;
    }
</style>
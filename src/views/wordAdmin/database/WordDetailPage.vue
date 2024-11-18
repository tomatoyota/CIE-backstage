<template>
    <div class="pa-7">
        <v-btn type="button" variant="tonal" class="font-weight-bold mb-7" @click.prevent="goToPrev">回上一頁</v-btn>
        <v-btn type="button" color="warning" flat class="font-weight-bold mb-7 ml-4" @click.prevent="copyLink">複製前台網址</v-btn>
        <p v-if="showBtn" class="font-weight-bold">
            來源動作
            <span :class="actionStyle" class="ms-2">{{ sourceAction }}</span>
        </p>
        <div class="content mt-14">
            <v-row class="justify-center" v-if="wordData">
                <v-col cols="6" md="4" class="position-relative">
                    <label class="sectionLabel">字詞</label>
                    <v-card class="pa-4 border-all h-100 d-flex align-center">
                    <p class="word font-kai">{{ wordData.wordText }}</p>
                    </v-card>
                </v-col>

                <v-col cols="6" md="4" class="position-relative">
                    <label class="sectionLabel">筆順動畫</label>
                    <v-card class="pa-6 border-all h-100 d-flex">
                    <v-row class="align-start">
                        <v-col cols="6" md="3" v-for="item in word" :key="item" class="stroke font-kai text-center">
                            {{ item }}
                        <v-icon icon="mdi mdi-play" @click="showAnimation(item)" size="20"></v-icon>
                        </v-col>
                    </v-row>
                    <!-- <template v-for="item in word">
                        
                        <span class="stroke font-kai">
                        {{ item }}
                        <v-icon icon="mdi mdi-play"  @click="showAnimation(item)" size="20"></v-icon>
                        </span>
                    </template> -->
                    </v-card>
                </v-col>

                <v-col cols="6" md="4" class="position-relative mt-md-0 mt-8">
                    <label class="sectionLabel">類別</label>
                    <v-card class="pa-4 border-all h-100 d-flex align-center justify-center">
                    <div>
                        <!-- <template> -->
                            <img class="d-block ml-auto mr-auto mb-2" :src="coreVocabularySvg">
                            <p class="text-center font-kai mb-0">{{ wordData.editDefinitions?.[0]?.classifyName }}</p>
                        <!-- </template> -->
                    </div>
                    </v-card>
                </v-col>
                <!-- <v-col cols="6" md="2" class="position-relative mt-md-0 mt-8">
                    <label class="sectionLabel">等級</label>
                    <v-card class="pa-4 border-all h-100 d-flex align-center justify-center">
                        <div>
                            <p class="text-center font-kai" v-for="level in wordData.editDefinitions" :key="level">
                                {{ '第' + levelLabel(level.level) + '級' }}
                            </p>
                        </div>
                    </v-card>
                </v-col> -->
            </v-row>

            <v-row class="position-relative" v-if="wordData">
                <div
                    @click="togglePanels"
                    class="sticky-btn shadow-yellow"
                >
                    <p v-if="expansion.length === 0">全部打開</p>
                    <p v-else>全部關閉</p>
                    <v-icon :icon="expansion.length === 0 ? 'mdi mdi-chevron-down' : 'mdi mdi-chevron-up'"></v-icon>
                </div>
                <v-expansion-panels
                    v-model="expansion"
                    multiple
                >
                    <v-col>
                        <v-expansion-panel
                            v-for="(item, index) in wordData.editDefinitions"
                            :key="item"
                            class="mb-4 shadow-yellow border-all"
                        >
                            <v-expansion-panel-title>
                                <span class="index">{{ index + 1 }}</span>
                                <v-row>
                                    <v-col cols="5">
                                        <p>{{ item.definitionText }}</p>
                                        <span>{{ item.definitionTranslated }}</span>
                                    </v-col>
                                    <v-col cols="5" class="pronun d-flex align-center">
                                        <span class="font-kai mr-4">{{ item.pronunDetails?.pinyin?.replace(',', '').replace(/\s/g, '') }}</span>
                                        <span class="font-kai zhuyin">{{ item.pronunDetails?.zhuyin?.replace(',', '') }}</span>
                                        <template v-if="item.voiceFiles.length !== 0">
                                            <audio hidden="true" ref="audio">
                                                <source :src="item.voiceFiles[0]?.filePath" type="audio/mpeg">
                                            </audio>
                                        </template>
                                        <div
                                            v-if="item.voiceFiles[0]"
                                        >
                                            <v-btn
                                                v-if="showPlay"
                                                size="30px"
                                                flat
                                                class="playSound"
                                                color="transparent"
                                                @click.stop="playSound(item.voiceFiles[0]?.filePath)"
                                            >
                                            <v-icon
                                                icon="mdi mdi-volume-high"
                                            ></v-icon>
                                            </v-btn>

                                            <v-btn
                                                v-else
                                                size="30px"
                                                flat
                                                class="playSound"
                                                color="transparent"
                                                :disabled="!lastAudio"
                                                @click.stop="pauseSound"
                                            >
                                                <v-icon
                                                    icon="mdi mdi-pause"
                                                ></v-icon>
                                            </v-btn>

                                            <v-btn
                                                size="30px"
                                                flat
                                                class="playSound"
                                                color="transparent"
                                                :disabled="!lastAudio"
                                                @click.stop="replaySound(item.voiceFiles[0].filePath)"
                                            >
                                                <v-icon
                                                    icon="mdi mdi-replay"
                                                ></v-icon>
                                            </v-btn>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="2" class="d-flex align-center px-1 py-1">
                                        <p class="text-center font-kai level" tabindex="0">
                                            {{ '第' + levelLabel(item.level) + '級' }}
                                        </p>
                                        </v-col>
                                </v-row>
                            
                            </v-expansion-panel-title>
                            <v-expansion-panel-text >
                                <v-row>
                                    <v-col cols="12" md="6" v-if="item.exampleSentence">
                                        <label class="d-block mb-1">例句</label>
                                        <p class="font-kai" v-html="item.exampleSentence"></p>
                                    </v-col>
                                    <v-col cols="12" md="3" v-if="item.collocation">
                                        <label class="d-block mb-1">用法 - 搭配詞</label>
                                        <p class="font-kai" v-html="item.collocation"></p>
                                    </v-col>
                                    <v-col cols="12" md="3" v-if="item.partOfSpeechName">
                                        <label class="d-block mb-1">詞性</label>
                                        <p class="font-kai" v-html="item.partOfSpeechName"></p>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="3" v-if="item.synonyms?.length > 0">
                                        <label class="d-block mb-1">近義詞</label>
                                        <p class="font-kai">{{ combineSynonyms(item.synonyms) }}</p>
                                    </v-col>
                                    <v-col cols="12" md="3" v-if="item.antonyms?.length > 0">
                                        <label class="d-block mb-1">反義詞</label>
                                        <p class="font-kai">{{ combineSynonyms(item.antonyms) }}</p>
                                    </v-col>
                                    
                                    <v-col class="d-flex wordTextImage" cols="12" md="3" v-if="item.imageFiles.length">
                                        <img
                                            v-for="image in item.imageFiles"
                                            :key="image"
                                            :src="image?.filePath"
                                        >
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-col>
                </v-expansion-panels>
            </v-row>
        </div>
        <div v-if="showBtn" class="text-center mt-7">
            <v-btn
                color="error"
                variant="flat"
                class="me-3"
                @click.prevent="RejectView"
            >
                退回
            </v-btn>
            <v-btn
                color="#1976D2"
                variant="flat"
                @click.prevent="passView"
            >
                通過
            </v-btn>
        </div>
    </div>

    <!-- 通過字條 -->
    <v-dialog v-model="passDialog" max-width="800px" max-height="600px" persistent>
        <PassComponent @close-dialog="passDialog = false" :action-type="passTitle" :from-detail="true"></PassComponent>
    </v-dialog>
    <!-- 退回 -->
    <v-dialog v-model="rejectDialog" max-width="500px" persistent>
        <RejectComponent @close-dialog="rejectDialog = false" :from-detail="true"></RejectComponent>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import helperUtil from '@/utils/helpers/helper.js';
import coreVocabularySvg from '@/assets/images/coreVocabulary.svg';
import { storeToRefs } from 'pinia';
import { useReviewdbStore } from '@/stores/Reviewdatabase.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const router = useRouter();

const store = useReviewdbStore();
const { selectedWord } = storeToRefs(store); // 搜尋條件、標題

// 退回字條
import RejectComponent from '@/components/database/RejectComponent.vue';
const rejectDialog = ref(false);
const fromDetail = ref(true);
const RejectView = (reject) => {
    const passWord = JSON.parse(localStorage.getItem('reviewword'));
    selectedWord.value = [passWord];
    rejectDialog.value = true;
};

// 通過字條
import PassComponent from '@/components/database/PassComponent.vue';
const passDialog = ref(false);
const passTitle = ref(null);
const passView = () => {
    const passWord = JSON.parse(localStorage.getItem('reviewword'));
    passTitle.value = '通過';
    selectedWord.value = [passWord];
    passDialog.value = true;
};

const goToPrev = () => {
    router.go(-1);
}

// expend panels
const expansion = ref([]);
const expansionSave = ref([]);
const togglePanels = () => {
    if(expansion.value.length !== 0){
        expansion.value = []
    }else{
        !!wordData.value.editDefinitions.length && (expansion.value = wordData.value.editDefinitions.map((item, index) => index));
    }
}

const combineSynonyms = (item) => {
    if (Array.isArray(item)) {
        const wordsArray = item.map(i => i.wordText); 
        const combinedString = wordsArray.join(', '); 
        return combinedString;
    } else {
        const combinedString = item
        return combinedString
    }
};


// 取得字詞資料
const wordData = ref(null);
const word = ref('');
onMounted(() => {
    const wordTextInfo = localStorage.getItem('wordTextInfo');
    if (wordTextInfo !== 'undefined') {
        wordData.value = JSON.parse(wordTextInfo);
        word.value = wordData.value.wordText;

        // 儲存字詞(筆順動畫使用)
        const wordList = [];
        if(word.value){
            for (let i = 0; i < word.value.length; i++) {
                const wordText = word.value[i];
                wordList.push(wordText);
            };
            localStorage.setItem('wordList', JSON.stringify(wordList));
        }
        
        // 處理音檔跟圖檔的路徑
        const definitions = wordData.value.editDefinitions;
        
        // 取得目前瀏覽器的地址
        const currentUrl = window.location.href;
        let url;
        
        if (currentUrl.includes('http://localhost') || currentUrl.includes('https://devcieestage')) {
            url = 'https://devcieestage.gogotest.xyz/media/words/';
        } else if (currentUrl.includes('https://cieestage')) {
            url = 'https://cieestage.gogotest.xyz/media/words/';
        } else if (currentUrl.includes('https://dlearnmbo.naer.edu.tw/')) {
            url = 'https://dlearnmbo.naer.edu.tw/media/words/'
        }

        for(let i = 0; i < definitions.length; i++) {
            if (definitions[i].voiceFiles.length) {
                definitions[i].voiceFiles[0].filePath = url + 'audio/' + definitions[i].voiceFiles[0].realFileName;
            }
            if (definitions[i].imageFiles.length) {
                for(let j = 0; j < definitions[i].imageFiles.length; j++){
                    definitions[i].imageFiles[j].filePath =  url + 'image/' + definitions[i].imageFiles[j].realFileName;
                }
            }
            if(definitions[i].exampleSentence){
                definitions[i].exampleSentence = definitions[i].exampleSentence.replace(/\r\n/g, '<br>');
                definitions[i].exampleSentence = definitions[i].exampleSentence.replace(/\n/g, '<br>');
            }
        };

        // 例句出現該字詞要 highlight
        for (let i = 0; i < definitions.length; i++) {
            const exampleSentence = definitions[i].exampleSentence;
            const collocation = definitions[i].collocation;
            const wordToHighlight = word.value;

            // 比對 exampleSentence
            if (typeof exampleSentence === 'string') {
                const regexExample = new RegExp(wordToHighlight, 'g');
                definitions[i].exampleSentence = exampleSentence.replace(regexExample, match => `<span class="matchText">${match}</span>`);
            }

            // 比對 collocation
            if (typeof collocation === 'string') {
                const regexCollocation = new RegExp(wordToHighlight, 'g');
                definitions[i].collocation = collocation.replace(regexCollocation, match => `<span class="matchText">${match}</span>`);
            }
        }
    }
});

// 播放
const showPlay = ref(true);
const pausedTime = ref(0);
const lastAudio = ref(null);
const playSound = (sound) => {
    pauseSound();

    const audio = new Audio(sound);
    lastAudio.value = audio;

    // 设置音频的初始时间
    audio.currentTime = pausedTime.value;

    // 添加 ended 事件监听器
    audio.addEventListener('ended', () => {
        showPlay.value = true;
        pausedTime.value = 0; // 播放结束后重置暂停时间
    });

    audio.play();
    showPlay.value = false;
};

const pauseSound = () => {
    if (lastAudio.value && !lastAudio.value.paused) {
        lastAudio.value.pause();
        showPlay.value = true;

        // 记录暂停时的时间
        pausedTime.value = lastAudio.value.currentTime;
    }
};

onBeforeUnmount(() => {
    pauseSound();
});

const replaySound = (sound) => {
    stopAndResetSound();
    playSound(sound);
};

const stopAndResetSound = () => {
    if (!lastAudio.value) return;
    // 移除 ended 事件监听器
    lastAudio.value.removeEventListener('ended', () => {
        showPlay.value = true;
        pausedTime.value = 0;
    });

    // 停止并重置音频
    lastAudio.value.pause();
    lastAudio.value.currentTime = 0;
    lastAudio.value = null;
    showPlay.value = true;
    pausedTime.value = 0;
}

// 是否顯示審核按鈕
const showBtn = computed(() => {
    return localStorage.getItem('path') === 'review';
});

// 來源動作文字對應
const actionStyle = ref('');
const sourceAction = computed(() => {
    const action = localStorage.getItem('sourceAction');
    actionStyle.value = helperUtil.reviewdbEditActionStyle(action); // 來源動作顏色套用
    return helperUtil.reviewdbActionText(action);
});

// 倒轉到筆畫順序動畫頁
const showAnimation = (item) => {
    const word = JSON.stringify({
        word: item
    });

    // 獲取目標路由的 URL
    const { href } = router.resolve({
        name: 'StrokeAnimation',
        params: { word }
    });

    // 打開新的窗口
    window.open(href, '_blank');
}

const copyLink = () => {
    const wordTextInfo = JSON.parse(localStorage.getItem('wordTextInfo'));
    let url;
    
    // 取得目前瀏覽器的地址
    const currentUrl = window.location.href;
    
    if (currentUrl.includes('http://localhost') || currentUrl.includes('https://devcieestage')) {
        url = 'https://devcieestage.gogotest.xyz//resultView/';
    } else if (currentUrl.includes('https://cieestage')) {
        url = 'https://cieestage.gogotest.xyz//resultView/';
    }else if(currentUrl.includes('https://dlearnmbo.naer.edu.tw')){
        url = 'https://dlearnmbo.naer.edu.tw/resultView/'
    }
    
    url += wordTextInfo.wordId;
    
    // 建立一個臨時的 textarea 元素來複製文字到剪貼簿
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = url;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    
    // 提示用戶已複製
    Swal.fire({
        toast: true,
        position: 'center',
        icon: 'success',
        title: `已成功複製字詞前台網址`,
        confirmButtonColor: '#0E2A34',
        confirmButtonText: '確認',
        background: '#F0F0F2',
        width: 400
    });
}

// 轉換等級
const levelLabel = (val) => {
    switch (val) {
        case 1:
            return '1';
        case 2:
            return '1*';
        case 3:
            return '2';
        case 4:
            return '2*';
        case 5:
            return '3';
        case 6:
            return '3*';
        case 7:
            return '4';
        case 8:
            return '4*';
        case 9:
            return '5';
        case 10:
            return '6';
        case 11:
            return '7';
        default:
            return '';
    }
}

</script>

<style lang="scss" scoped>
.topBar{
    @media (max-width: 480px) {
        .v-btn{
            min-width: none;
            padding: 0 12px;
            :deep(.v-btn__content){
                font-size: 12px;
                
            }
        }  
    }
}
.sticky-btn{
    position: fixed;
    z-index: 2;
    right: -5px;
    background-color: #E9C46A;
    font-size: 18px;
    border-radius: 4px;
    border: 1px solid #4a4a4a;
    padding: 8px;
    color: white;
    text-align: center;
    cursor: pointer;
}
.word{
    font-size: 3rem;
    word-break: break-all
}
.wordLevel{
    position: absolute;
    top: -4px;
    left: -4px;
    border-bottom-right-radius: 8px;
    background-color: var(--primary);
    color: white;
    padding: 4px 8px;
}
.v-expansion-panel-title{
    p{
        font-size: 1.5rem;

        @media (max-width: 480px) {
        font-size: 1.25rem;
        }
    }
    span{
        font-size: 1rem;
        font-weight: 400;
    }
    .index{
        position: absolute;
        left: -10px;
        top: -10px;
        font-size: 1rem;
        background-color: #E9C46A;
        width: 30px;
        height: 30px;
        border-radius: 100px;
        text-align: center;
        padding-top: 8px;
        border: 1px solid #4a4a4a
    }
}
.v-expansion-panel-title--active{
    background-color: white;
    :deep(.v-expansion-panel-title__overlay){
        display: none;
    }
}
.v-btn--disabled{
    opacity: .2;
    background: none;
    :deep(.v-btn__overlay){
        display: none !important;
    }
}
:deep(.v-expansion-panels){
.v-expansion-panel-title{
    font-size: 1.5rem;
    font-weight: 900;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .12);
    .pronun{
    span{
        margin-right: 5px;
        font-size: 1rem;
    }
    }
}
.v-expansion-panel-text{
    background-color: #FAFAFA;
    label{
        font-weight: 900;
        font-size: 1.125rem;
    }
}
}
.stroke{
    font-size: 2.5rem;
    background-color: #d9d9d9;
    border: 1px solid #9b9b9b;
    padding: 12px;
    position: relative;
    .v-icon{
        position: absolute;
        bottom: 0px;
        right: 0px;
        background-color: rgba($color: white, $alpha: .4);
    }
}
.sectionLabel{
    position: absolute;
    top: -18px;
    left: 12px;
    background-color: #E9C46A;
    border: 1px solid #4a4a4a;
    border-bottom: 0;
    padding: 4px 8px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    font-size: 1.125rem;
    font-weight: 900;
}
.zhuyin{
    position: relative;
    font-size: 14px !important;
    font-weight: 400 !important;

    &:has(.lightSound){
        margin-top: -8px;
    }
    :deep(span.lightSound){
        position: relative;
        top: 10px;
        font-size: 1.5rem !important;
        margin: -8px 2px 0 3px !important;
    }
}
:deep(span.matchText){
    background-color: #E9C46A;
    padding: 2px;
    border-radius: 4px;
}

.border-all{
    border: 1px solid #4A4A4A;
}
.shadow-yellow{
    box-shadow: 8px 8px 0px rgba($color: #E9C46A, $alpha: .6);
}

/* 字詞狀態顏色 */
.word-general {
    color: #4CAF50;
}
.word-edit {
    color: #FF9800;
}
.word-unpublish {
    color: #9E9E9E;
}
.word-delete {
    color: #F61E1E;
}
.word-submit {
    color: #2196F3;
}
.wordTextImage{
    align-items: center;
    img{
        max-width: 100%;
        max-height: 60%;
    }
}
.level{
    font-size: 0.875rem !important;
    font-weight: 400 !important;
    margin-bottom: 0px !important;

    @media (max-width: 480px) {
      order: 1;
    }
  }
</style>

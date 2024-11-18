<template>
    <!-- 刪除、選取詞條刪除 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">{{ previewData.wordText }} 音檔查看</h5>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="4">義項序</v-col>
                        <v-col cols="8">{{ previewData.sequence }}</v-col>
                        <v-col cols="4">音檔名稱</v-col>
                        <v-col cols="8">{{ decodeURIComponent(previewData.data.originalFileName) }}</v-col>
                        <v-col cols="4">上傳時間</v-col>
                        <v-col cols="8">{{ this.formatDate(previewData.data.updatedAt) }}</v-col>
                        <v-col cols="4">上傳者</v-col>
                        <v-col cols="8">{{ previewData.data.creator }}</v-col>
                        <v-col cols="4">音檔說明</v-col>
                        <v-col cols="8">{{ previewData.data.description || '無相關資料' }}</v-col>
                        <v-col cols="4">音檔來源</v-col>
                        <v-col cols="8">{{ previewData.data.sourceUrl || '無相關資料' }}</v-col>
                    </v-row>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-center">
                    <v-btn variant="flat" size="60px" @click="playAudio">
                        <v-icon icon="mdi mdi-play-circle-outline" size="60px"></v-icon>
                    </v-btn>
                    <v-btn variant="flat" size="60px" @click="pauseAudio">
                        <v-icon icon="mdi mdi-pause" size="60px"></v-icon>
                    </v-btn>
                    <v-btn variant="flat" size="60px" @click="stopAudio">
                        <v-icon icon="mdi mdi-stop" size="60px"></v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="black"
                variant="tonal"
                class="font-weight-bold"
                @click="closeDialog"
            >
                關閉
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props:{
        previewData: Object
    },
    data() {
        return {
            audioSrc: '',
            playBtn: true,
            pauseBtn: false,
            audio: null,
        }
    },
    watch:{
        previewData: {
            handler(n) {
                if(n){
                    this.errorList = n;
                    this.cleanData();
                }
            },
            immediate: true
        }
    },
    methods:{
        cleanData(){
            const currentUrl = window.location.href;
            let url;
            if (currentUrl.includes('http://localhost') || currentUrl.includes('https://devcieestage')) {
                url = 'https://devcieestage.gogotest.xyz/';
            } else if (currentUrl.includes('https://cieestage')) {
                url = 'https://cieestage.gogotest.xyz/';
            }else if(currentUrl.includes('https://dlearnmbo.naer.edu.tw')){
                url = 'https://dlearnmbo.naer.edu.tw/'
            }
            this.audioSrc = decodeURIComponent( url + 'media/words/audio/' + this.previewData.data.realFileName)
            this.audio = new Audio(this.audioSrc);
        },
        closeDialog(){
            this.$emit('closeDialog')
            this.audio.pause()
            this.audio = null
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            const isUtc = !dateStr.includes('Z') && !dateStr.includes('+') && !dateStr.includes('-');
            if (isUtc) {
                date.setHours(date.getHours() + 8); // Taiwan is UTC+8
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}`;
            return formattedDateTime;
        },
        playAudio() {
            this.audio.play();
            this.playBtn = false
            this.pauseBtn = true
        },
        pauseAudio() {
            this.audio.pause();
            this.playBtn = true
            this.pauseBtn = false
        },
        stopAudio() {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            } 
        }
    },
}

</script>

<style lang="scss" scoped>
.img-width{
    width: 100%;
    max-width: 100%
}
</style>
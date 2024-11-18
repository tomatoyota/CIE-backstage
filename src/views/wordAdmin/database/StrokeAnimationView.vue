<template>
  <section class="strokePlayer bg-yellow py-4">
    <v-container>
      <p class="text-center mb-2">{{ $t('source') }}</p>
      <v-row>
        <v-col class="d-flex justify-center">
          <div id="stroke_player" ref="stroke"></div>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="3" md="1" class="stroke" :class="item.active ? 'active' : '' " v-for="item in wordList" :key="item" @click="getStroke(item)">
          {{ item.word }}
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
        word: '',
        // loading: false,
        wordList: []
      };
  },
  created(){
    // this.loading = true
    this.checkAndUpdateParam()
  },
  mounted() {
    this.observeBtnPause();
    this.observeScriptLoad('https://stroke-order.learningweb.moe.edu.tw/stroke_exercise_resources/js/stroke-player.js', this.onScriptLoad);
  },
  
  methods:{
    observeScriptLoad(scriptSrc, callback) {
      const targetNode = document.head;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes) {
            for (const node of mutation.addedNodes) {
              if (node.tagName === 'SCRIPT' && node.src === scriptSrc) {
                // 找到目標 script 元素
                callback();
                observer.disconnect(); // 停止監視，因為已經執行了一次
              }
            }
          }
        });
      });

      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);
    },

    onScriptLoad() {
      this.observeBtnPause()
    },
    observeBtnPause() {
      const targetNode = document.documentElement;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes) {
            for (const node of mutation.addedNodes) {
              if (node.id === 'mask') {
                this.checkChildElements(node);

                const btnVoiceStop = node.querySelector('#btnVoiceStop');
                const btnVoicePlay = node.querySelector('#btnVoicePlay');
                if (btnVoiceStop && btnVoicePlay) {
                  this.handleBtnVoicePlay(btnVoiceStop, btnVoicePlay);
                }
              }
            }
          }
        });
      });
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);
    },
    checkChildElements(maskElement) {
      for (const childNode of maskElement.childNodes) {
        if (childNode.nodeType === 1) {
          const btnPauseElement = childNode.querySelector('#btnPause');
          btnPauseElement.addEventListener('click', this.handleBtnPauseClick);
          if (btnPauseElement) {
            this.observeBtnPauseStyle(btnPauseElement);
          }
        }
      }
    },
    handleBtnPauseClick() {
      // 新的點擊事件處理函數
      console.log('新的點擊事件被觸發');
    },
    observeBtnPauseStyle(btnPauseElement) {
      const styleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
            const currentDisplayStyle = btnPauseElement.style.display;
            if (currentDisplayStyle === 'none') {
              this.handleBtnPauseHidden();
            }
          }
        });
      });
      const config = { attributes: true, attributeFilter: ['style'] };
      styleObserver.observe(btnPauseElement, config);
    },
    handleBtnPauseHidden() {
      this.autoPlay()
    },
    handleBtnVoicePlay(btnStop, btnPlay){
      setTimeout(() => {
        btnPlay.click();
      }, 100);
      
    },
    autoPlay(){
      const param = JSON.parse(this.$route.params.word);
      const currentWord = param.word
      const wordList = this.wordList
      const currentIndex = wordList.findIndex(word => word.word === currentWord);
      if (currentIndex !== -1 && currentIndex < wordList.length - 1) {
        const nextWord = wordList[currentIndex + 1];
        this.getStroke(nextWord)
      } else {
        return
      }
    },

    getStroke(item) {
      const word = JSON.stringify({
        word: item.word
      });
      this.$router.replace({
        name: 'StrokeAnimation',
        params: { word }
      });
      setTimeout(() => {
        window.location.reload()
      }, 100);
    },

    checkAndUpdateParam() {
      const param = JSON.parse(this.$route.params.word);
      this.word = param.word;
      const rawWordList = JSON.parse(localStorage.getItem('wordList'));
      let temptWordList = []
      for(let i = 0; i < rawWordList.length; i++){
        
        const wordList = {
          word: rawWordList[i],
          active: null
        }
        if(wordList.word === this.word){
          wordList.active = true
          temptWordList.push(wordList)
        }else{
          wordList.active = false
          temptWordList.push(wordList)
        }
      }
      this.wordList = temptWordList;
      this.convertToUnicode();
    },
    convertToUnicode() {
      const text = this.word;
      let unicodeString = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i).toString(16).toUpperCase();
        unicodeString += charCode.padStart(4, '0');
      };
      this.loadPlayerShareScript(unicodeString);
    },

    // 引入筆畫順序
    loadPlayerShareScript(unicodeString) {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://stroke-order.learningweb.moe.edu.tw/js/playerShare.js';
      scriptElement.onload = () => {
        const playerShare = new PlayerShare('https://stroke-order.learningweb.moe.edu.tw/', `${unicodeString}`, '0', 'zh_TW');
        playerShare.load();
      };
      document.head.appendChild(scriptElement);
      this.loading = false
      // this.observeBtnPause();
    },
  }
}
</script>

<style lang="scss" scoped>
  .strokePlayer{
    min-height: calc(100vh - 320px);
    background-image: url('@/assets/images/bg04.svg');
    background-size: 100%;
  }
  .stroke{
    font-size: 2.5rem;
    background-color: #d9d9d9;
    border: 1px solid #9b9b9b;
    padding: 12px;
    position: relative;
    margin-right: 4px;
    text-align: center;
    cursor: pointer;
    .v-icon{
      position: absolute;
      bottom: 0px;
      right: 0px;
      background-color: rgba($color: white, $alpha: .4);
    }
    &.active{
      background-color: white;
    }
  }
</style>
<template>
  <div ref="pinyinKeyboard" class="pinyinKeyboard border-all">
    <div class="close" @click="closeKeyboard()">X</div>
    <v-row  v-for="row in pinyinKeyboard">
      <v-col cols="2" md="1" class="label" v-for="item in row.row">
        <v-btn flat class="text-center w-100" :class="row.type" size="normal" :disabled="!item.label" @click="addpinyinKeyboard(row.type, item)" :color="item.val == '清除' ? 'red' : ''">
          {{ item.label }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props:{
    originalPinyin: String,
  },
  data() {
    return {
      text: [],
      vowelMatch: {},
      pinyinKeyboard:[
        {
          type: 'consonant',
          row:[
            {
              label: 'b',
              val: 'b',
            },
            {
              label: 'p',
              val: 'p',
            },
            {
              label: 'm',
              val: 'm',
            },
            {
              label: 'f',
              val: 'f',
            },
            {
              label: 'd',
              val: 'd',
            },
            {
              label: 't',
              val: 't',
            },
            {
              label: 'n',
              val: 'n',
            },
            {
              label: 'l',
              val: 'l',
            },
            {
              label: 'g',
              val: 'g',
            },
            {
              label: 'k',
              val: 'k',
            },
            {
              label: 'h',
              val: 'h',
            },
          ],
          
        },
        {
          type: 'consonant',
          row:[
            {
              label: 'j',
              val: 'j',
            },
            {
              label: 'q',
              val: 'q',
            },
            {
              label: 'x',
              val: 'x',
            },
            {
              label: 'zh',
              val: 'zh',
            },
            {
              label: 'ch',
              val: 'ch',
            },
            {
              label: 'sh',
              val: 'sh',
            },
            {
              label: 'r',
              val: 'r',
            },
            {
              label: 'z',
              val: 'z',
            },
            {
              label: 'c',
              val: 'c',
            },
            {
              label: 's',
              val: 's',
            },
            
          ]
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'a',
              val: 'a',
            },
            {
              label: 'ai',
              val: 'ai',
            },
            {
              label: 'an',
              val: 'an',
            },
            {
              label: 'ang',
              val: 'ang',
            },
            {
              label: 'ao',
              val: 'ao',
            },
            
            
            
            
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'e',
              val: 'e',
            },
            {
              label: 'ê',
              val: 'ê',
            },
            {
              label: 'ei',
              val: 'ei',
            },
            {
              label: 'en',
              val: 'en',
            },
            {
              label: 'eng',
              val: 'eng',
            },
            {
              label: 'er',
              val: 'er',
            },
            
            
            
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'i',
              val: 'i',
            },
            {
              label: 'ia',
              val: 'ia',
            },
            {
              label: 'ian',
              val: 'ian',
            },
            {
              label: 'iang',
              val: 'iang',
            },
            {
              label: 'iao',
              val: 'iao',
            },
            {
              label: 'ie',
              val: 'ie',
            },
            {
              label: 'in',
              val: 'in',
            },
            {
              label: 'ing',
              val: 'ing',
            },
            {
              label: 'iong',
              val: 'iong',
            },
            {
              label: 'iu',
              val: 'iu',
            },
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'yi',
              val: 'yi',
            },
            {
              label: 'ya',
              val: 'ya',
            },
            {
              label: 'ye',
              val: 'ye',
            },
            {
              label: 'yao',
              val: 'yao',
            },
            {
              label: 'you',
              val: 'you',
            },
            {
              label: 'yan',
              val: 'yan',
            },
            {
              label: 'yin',
              val: 'yin',
            },
            {
              label: 'yang',
              val: 'yang',
            },
            {
              label: 'ying',
              val: 'ying',
            },
            {
              label: 'yong',
              val: 'yong',
            },
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'o',
              val: 'o',
            },
            {
              label: 'ong',
              val: 'ong',
            },
            {
              label: 'ou',
              val: 'ou',
            },
            
            
            
            
            
            
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'u',
              val: 'u',
            },
            {
              label: 'ua',
              val: 'ua',
            },
            {
              label: 'uai',
              val: 'uai',
            },
            {
              label: 'uan',
              val: 'uan',
            },
            {
              label: 'uang',
              val: 'uang',
            },
            {
              label: 'ue',
              val: 'ue',
            },
            {
              label: 'ui',
              val: 'ui',
            },
            {
              label: 'un',
              val: 'un',
            },
            {
              label: 'uo',
              val: 'uo',
            },
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'wu',
              val: 'wu',
            },
            {
              label: 'wa',
              val: 'wa',
            },
            {
              label: 'wo',
              val: 'wo',
            },
            {
              label: 'wai',
              val: 'wai',
            },
            {
              label: 'wei',
              val: 'wei',
            },
            {
              label: 'wan',
              val: 'wan',
            },
            {
              label: 'wen',
              val: 'wen',
            },
            {
              label: 'wang',
              val: 'wang',
            },
            {
              label: 'weng',
              val: 'weng',
            },
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'ü',
              val: 'ü',
            },
            
            
            
            
            
            
            
            
            
            
          ],
        },
        {
          type: 'vowel',
          row:[
            {
              label: 'yu',
              val: 'yu',
            },
            {
              label: 'yue',
              val: 'yue',
            },
            {
              label: 'yuan',
              val: 'yuan',
            },
            {
              label: 'yun',
              val: 'yun',
            },
            
            
            
            
            
            
            
          ],
        },
        {
          type: 'helpers',
          row:[
            {
              label: '1',
              val: '1',
            },
            {
              label: '2',
              val: '2',
            },
            {
              label: '3',
              val: '3',
            },
            {
              label: '4',
              val: '4',
            },
            {
              label: ',',
              val: ',',
            },
            
            {
              label: '清除',
              val: '清除',
            },
            
            
            
            
            
          ],
        },
      ],
    };
  },
  watch:{
    searchContent(val){
      this.text = []
      for(let i = 0; i < val.length; i++){
        this.text.push(val[i])
      }
    },
  },
  mounted(){
    if(this.originalPinyin){
      this.text.push(this.originalPinyin)
    }
  },
  methods:{
    addpinyinKeyboard(type, item) {
      this.text = item.label;
      this.$emit('text-updated', this.text);
    },
    closeKeyboard(){
      this.$emit('close-keyboard', this.text)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pinyinKeyboard{
    position: absolute;
    top: 80px;
    left: 100%;
    transform: translateX(-50%);
    width: 960px;
    margin: auto;
    background-color: white;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border: 2px solid #e2e2e2;
    padding: 15px;
    transition: .2s;
    z-index: 1;

    .label{
      text-align: center;
      padding: 4px;
      margin-bottom: 8px;
      
      .v-btn{
        border: 1px solid #e2e2e2;
        text-transform: lowercase;
        font-size: 0.875rem;
        font-weight: 400;
        height: 100%;
        padding: 6px 0;
        
        &.v-btn--disabled{
          border: 1px solid rgb(255, 255, 255);
          color: white;
          padding: 13.5px 0 !important;
        }
        p{
          background-color: white;
        }
      }
    }
  }
  .close{
    position: absolute;
    right: -5px;
    top: -5px;
    width: 25px;
    height: 25px;
    background-color: #e42c2c;
    color: white;
    border-radius: 100px;
    text-align: center;
    padding-top: 5px;
    cursor: pointer;
  }    
</style>
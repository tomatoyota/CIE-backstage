<template>
  <div ref="zhuyinKeyboard" class="zhuyinKeyboard shadow-yellow border-all" :class="isActive ? 'active' : ''">
    <div class="close" @click="closeKeyboard()">X</div>
    <v-row>
      <v-col v-for="row in zhuyin">
        <v-row class="flex-column" v-for="item in row.row">
          <v-col class="label">
            <v-btn flat class="text-center w-100 font-kai" :class="isHelper(item.label) ? 'isHelper' : '', item.label === '清除' ? 'font-12': ''" size="normal" :disabled="!item.label" @click="addzhuyin(item.val)" :color="item.val == '清除' ? 'red' : ''">
              {{ item.label }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  props:{
    isActive: Boolean,
    searchContent: String,
    originalZhuyin: String,
  },
  data() {
    return {
      text: [],
      zhuyin:[
        {
          row:[
            {
              label: 'ㄅ',
              val: 'ㄅ'
            },
            {
              label: 'ㄆ',
              val: 'ㄆ',
            },
            {
              label: 'ㄇ',
              val: 'ㄇ',
            },
            {
              label: 'ㄈ',
              val: 'ㄈ',
            },
            {
              label: '-',
              val: '',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄉ',
              val: 'ㄉ'
            },
            {
              label: 'ㄊ',
              val: 'ㄊ',
            },
            {
              label: 'ㄋ',
              val: 'ㄋ',
            },
            {
              label: 'ㄌ',
              val: 'ㄌ',
            },
            {
              label: 'ˊ',
              val: 'ˊ',
            },
          ],
        },
        {
          row:[
            {
              label: '',
              val: ''
            },
            {
              label: 'ㄍ',
              val: 'ㄍ',
            },
            {
              label: 'ㄎ',
              val: 'ㄎ',
            },
            {
              label: 'ㄏ',
              val: 'ㄏ',
            },
            {
              label: 'ˇ',
              val: 'ˇ',
            },
          ],
        },
        {
          row:[
            {
              label: '',
              val: ''
            },
            {
              label: 'ㄐ',
              val: 'ㄐ',
            },
            {
              label: 'ㄑ',
              val: 'ㄑ',
            },
            {
              label: 'ㄒ',
              val: 'ㄒ',
            },
            {
              label: 'ˋ',
              val: 'ˋ',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄓ',
              val: 'ㄓ'
            },
            {
              label: 'ㄔ',
              val: 'ㄔ',
            },
            {
              label: 'ㄕ',
              val: 'ㄕ',
            },
            {
              label: 'ㄖ',
              val: 'ㄖ',
            },
            {
              label: '˙',
              val: '˙',
            },
          ],
        },
        {
          row:[
            {
              label: '',
              val: ''
            },
            {
              label: 'ㄗ',
              val: 'ㄗ',
            },
            {
              label: 'ㄘ',
              val: 'ㄘ',
            },
            {
              label: 'ㄙ',
              val: 'ㄙ',
            },
            {
              label: ',',
              val: ',',
            },
          ],
        },
        {
          row:[
            {
              label: '',
              val: ''
            },
            {
              label: 'ㄧ',
              val: 'ㄧ',
            },
            {
              label: 'ㄨ',
              val: 'ㄨ',
            },
            {
              label: 'ㄩ',
              val: 'ㄩ',
            },
            {
              label: '清除',
              val: '清除',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄚ',
              val: 'ㄚ'
            },
            {
              label: 'ㄛ',
              val: 'ㄛ',
            },
            {
              label: 'ㄜ',
              val: 'ㄜ',
            },
            {
              label: 'ㄝ',
              val: 'ㄝ',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄞ',
              val: 'ㄞ'
            },
            {
              label: 'ㄟ',
              val: 'ㄟ',
            },
            {
              label: 'ㄠ',
              val: 'ㄠ',
            },
            {
              label: 'ㄡ',
              val: 'ㄡ',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄢ',
              val: 'ㄢ'
            },
            {
              label: 'ㄣ',
              val: 'ㄣ',
            },
            {
              label: 'ㄤ',
              val: 'ㄤ',
            },
            {
              label: 'ㄥ',
              val: 'ㄥ',
            },
          ],
        },
        {
          row:[
            {
              label: 'ㄦ',
              val: 'ㄦ'
            },
            {
              label: '',
              val: '',
            },
            {
              label: '',
              val: '',
            },
            {
              label: '',
              val: '',
            },
          ],
        },
      ],
      fontSize:''
    };
  },
  mounted(){
    if(this.originalZhuyin){
      this.text.push(this.originalZhuyin)
    }
  },
  watch:{
    searchContent(val){
      this.text = []
      for(let i = 0; i < val.length; i++){
        this.text.push(val[i])
      }
    },
  },
  methods:{
    getZhuyinHeight(){
      const zhuyinHeight = this.$refs.zhuyinKeyboard.clientHeight
      this.$emit('getHeight', zhuyinHeight)
    },
    addzhuyin(item) {
      this.text = item
      this.$emit('text-updated', this.text);
    },
    isHelper(data){
      const helper = /[-ˊˇˋ˙,]/;
      return helper.test(data);
    },
    closeKeyboard(){
      this.$emit('close-keyboard', this.text)
    }
  }
}
</script>

<style lang="scss" >
  .isHelper{
    span.v-btn__content{
      font-size: 1.5rem;
      line-height: 1rem;
    }
  }
  .notice{
    margin: 0 auto 20px auto;
    font-size: 0.875rem;
    background-color: rgba($color: white, $alpha: .4);
    color: #8f8f8f;
  }
  .zhuyinKeyboard{
    position: absolute;
    top: 80px;
    left: 0%;
    transform: translateX(-50%);
    width: 960px;
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
        padding: 6px 0;

        &.v-btn--disabled{
          border: 1px solid white;
          color: white;
          padding: 13.5px 0 !important;
        }
        p{
          background-color: white;
        }
      }
    }
    @media (max-width: 480px) {
      bottom: -500px;
      padding: 30px 15px 30px 15px;

      &.active{
        bottom: 0px;
      }
      .label{
        padding: 2px 0px;
        font-size: 0.75rem;
        .v-btn{
          width: 28px !important;
          &.v-btn--disabled{
            padding: 15.5px 0 !important;
          }
          p{
            background-color: white;
          }
        }
      }
    }
  }
  .close{
    position: absolute;
    right: -10px;
    top: -10px;
    width: 25px;
    height: 25px;
    background-color: #e42c2c;
    color: white;
    border-radius: 100px;
    text-align: center;
    padding-top: 5px;
    cursor: pointer;
    z-index: 1;
  }    
</style>
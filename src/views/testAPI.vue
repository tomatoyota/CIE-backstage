<template>
  <div>
    <h1>API 測試結果</h1>
    <p v-if="error">發生錯誤：{{ error }}</p>
    <div v-if="data">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import testSrv from '@/service/test.js'

export default {
  data() {
    return {
      data: null,
      error: null,
    };
  },
  methods: {
  
      fetchData() {
      // 第一步：設置自定義的請求標頭
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here'
      };

      // 第二步：使用 testSrv.test() 發送帶有標頭的請求
      testSrv.test({ headers })
        .then((res) => {
          this.data = res.data; // 假設返回的數據在 res.data 中
          console.log(res);
        })
        .catch((error) => {
          this.error = error.message; // 如果請求失敗，顯示錯誤訊息
          console.error('API 請求錯誤:', error);
        });
    },
    // fetchData(){
    //   testSrv.test().then((res) => {
    //     console.log(res)
    //   })
    // },
    // async fetchData() {
    //   try {
    //     const response = await axios.get('/test');
    //     this.data = response.data; // 假設 API 返回的數據在 data 屬性中
    //   } catch (error) {
    //     this.error = error.message;
    //   }
    // },
  },
  mounted() {
    this.fetchData(); // 組件掛載後立即發送請求
  },
};
</script>

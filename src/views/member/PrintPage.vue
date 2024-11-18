<template>
  <div>
    <v-checkbox label="顯示框線" v-model="showBorder"></v-checkbox>
    <v-btn @click="print()">列印</v-btn>
  </div>
  <div class="print-page">
    <div v-for="(pageData, pageIndex) in paginatedPrintData" :key="pageIndex" class="a4-page">
      
      <div v-for="(item, index) in pageData" :key="index" class="print-item" :class="showBorder ? 'show-border' : '', item.accountType !== 1 ? 'd-none' : ''">
        <template v-if="item.accountType === 1">
          <div class="address">
            {{item.Individuals[0].mainAddressPostal}} {{ item.Individuals[0].mainCity }}{{ item.Individuals[0].mainDistrict }}{{ item.Individuals[0].mainAddressDetail }}
          </div>

          <div class="addressAdditional">
            <span></span>
          </div>

          <div class="name">
            <span class="nameInfo">{{ item.Individuals[0].chineseName }}</span>
            <span class="genderInfo">{{ convertGender(item.Individuals[0].gender) }}</span>
            收
          </div>

          <div class="memberDetail">
            <span class="typeInfo">
              {{ convertIndividualLevel(item.accountType) }}
            </span>
            <span class="idInfo">
              {{ item.frontUserId }}
            </span>
          </div>
        </template>    
      </div>
    
      <div v-for="(item, index) in pageData" :key="index" class="print-item" :class="showBorder ? 'show-border' : '', item.accountType !== 2 ? 'd-none' : ''">
        <template v-if="item.accountType === 2">
          <div class="address">
            {{item.Organizations[0].mainAddressPostal}} {{ item.Organizations[0].mainCity }}{{ item.Organizations[0].mainDistrict }}{{ item.Organizations[0].mainAddressDetail }}
          </div>

          <div class="addressAdditional">
            <span></span>
          </div>

          <div class="name">
            <span class="nameInfo">{{ item.Organizations[0].chineseName }}</span>
            收
          </div>

          <div class="memberDetail">
            <span class="typeInfo">
              {{ convertIndividualLevel(item.accountType) }}
            </span>
            <span class="idInfo">
              {{ item.frontUserId }}
            </span>
          </div>
        </template>
      </div>

      <div v-for="(item, index) in pageData" :key="index" class="print-item" :class="showBorder ? 'show-border' : '', item.accountType !== 3 ? 'd-none' : ''">
        <template v-if="item.accountType === 3">
          <div class="address">
            {{item.Students[0].mainAddressPostal}} {{ item.Students[0].mainCity }}{{ item.Students[0].mainDistrict }}{{ item.Students[0].mainAddressDetail }}
          </div>

          <div class="addressAdditional">
            <span></span>
          </div>

          <div class="name">
            <span class="nameInfo">{{ item.Students[0].chineseName }}</span>
            收
          </div>

          <div class="memberDetail">
            <span class="typeInfo">
              {{ convertIndividualLevel(item.accountType) }}
            </span>
            <span class="idInfo">
              {{ item.frontUserId }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { usePrintStore } from '@/stores/Print.js';

export default {
  data() {
    return {
      printData: [],
      paginatedPrintData: [], // 用於存放分頁後的數據
      showBorder: true,
    };
  },
  mounted() {
    this.setPage();
  },

  methods: {
    print() {
      window.print();
    },
    setPage() {
      const printData = localStorage.getItem('printData');
      this.printData = JSON.parse(printData);
      console.log(this.printData)
      // 每頁 16 個分組，分頁處理
      const itemsPerPage = 16;
      for (let i = 0; i < this.printData.length; i += itemsPerPage) {
        this.paginatedPrintData.push(this.printData.slice(i, i + itemsPerPage));
        console.log(this.paginatedPrintData)
      }
    },
    convertGender(value){
      if(value){
        switch(value){
          case 1:
            return '先生';
          case 2:
            return '女士';
          default:
            return '';
        }
      }
    },
    convertIndividualLevel(value){
      if(value){
        switch(value){
          case 1:
            return '初';
          case 2:
            return '正';
          case 3:
            return '永';
          default:
            return '';
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
/* 原本的 .print-page、.a4-page、.print-item 样式 */
.print-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: '新細明體', 'PMingLiU', 'MingLiU', 'Times New Roman', sans-serif !important;
  font-weight: normal;
  font-style: normal;
  page-break-inside: avoid;
  font-size: 12pt;
}

.a4-page {
  width: 210mm;
  height: 297mm;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid #333;
  justify-content: flex-start;
  align-content: flex-start;
  page-break-after: always;
}
.show-border{
  border: 1px solid #333;
}
.print-item {
  width: 50%;
  height: 37mm;
  box-sizing: border-box;
  padding: 15px;
  > * {
    min-height: 15px;
    margin-bottom: 5px;
  }
  .address { }
  .name {
    .nameInfo { margin-left: 30px; }
    .genderInfo { margin-left: 20px; }
  }
  .memberDetail {
    text-align: right;
    .typeInfo { margin-right: 10px; }
  }
}

/* 列印模式下只顯示 .print-page 區域 */
@media print {
  /* 隱藏其他內容 */
  body {
    display: none !important;
    background-color: white !important;
  }

  /* 顯示並定位 print-page */
  .print-page{
    display: flex !important;
    visibility: visible !important;
  }
  .show-border{
    border: 1px solid #333;
  }
  /* 讓 print-page 佔據整個頁面 */
  .print-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 210mm;
    height: 297mm;
    z-index: 9999;
    background-color: white;
  }
}
</style>
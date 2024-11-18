<template>
  <div>
    <v-btn @click="print()">列印</v-btn>
  </div>
  <div class="print-page">
    <div v-for="(pageData, pageIndex) in paginatedPrintData" :key="pageIndex" class="a4-page">
      <div v-for="invoiceItem in pageData" class="print-item">
        
        <div class="first mb-8">
          <h4 class="text-center">社團法人中國電機工程學會</h4>

          <h2 class="text-center">
            收款收據
            <span>{{ invoiceItem.paymentYear }}</span>年
            <span>{{ convertDate(invoiceItem.paymentDate) }}</span>
          </h2>
          <div class="d-flex">
            <div class="tableContainer">
              <v-table class="firstTable">
                <tbody>
                  <tr>
                    <td>繳款人</td>
                    <td>{{ invoiceItem.payerName }}</td>
                  </tr>
                  <tr>
                    <td>款別</td>
                    <td>{{ invoiceItem.title }}</td>
                  </tr>
                  <tr>
                    <td>金額</td>
                    <td>{{ invoiceItem.amount }}</td>
                  </tr>
                  <tr>
                    <td>備註</td>
                    <td>{{ invoiceItem.comment }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-row class="mt-1">
                <v-col class="offset-3">總會計</v-col>
                <v-col>經收人</v-col>
              </v-row>
            </div>
            <div class="invoiceType">第一聯:存根聯</div>
          </div>
          
        </div>

        <div class="second mb-8">
          <h4 class="text-center">社團法人中國電機工程學會</h4>

          <h2 class="text-center">
            收款收據
            <span>{{ invoiceItem.paymentYear }}</span>年
            <span>{{ convertDate(invoiceItem.paymentDate) }}</span>
          </h2>
          <div class="d-flex">
            <div class="tableContainer">
              <v-table class="firstTable">
                <tbody>
                  <tr>
                    <td>繳款人</td>
                    <td>{{ invoiceItem.payerName }}</td>
                  </tr>
                  <tr>
                    <td>款別</td>
                    <td>{{ invoiceItem.title }}</td>
                  </tr>
                  <tr>
                    <td>金額</td>
                    <td>{{ invoiceItem.amount }}</td>
                  </tr>
                  <tr>
                    <td>備註</td>
                    <td>{{ invoiceItem.comment }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-row class="mt-1">
                <v-col class="offset-3">總會計</v-col>
                <v-col>經收人</v-col>
              </v-row>
            </div>
            <div class="invoiceType">第二聯:報核聯</div>
          </div>
          
        </div>

        <div class="third">
          <h4 class="text-center">社團法人中國電機工程學會</h4>

          <h2 class="text-center">
            收款收據
            <span>{{ invoiceItem.paymentYear }}</span>年
            <span>{{ convertDate(invoiceItem.paymentDate) }}</span>
          </h2>
          <div class="d-flex">
            <div class="tableContainer">
              <v-table class="firstTable">
                <tbody>
                  <tr>
                    <td>繳款人</td>
                    <td>{{ invoiceItem.payerName }}</td>
                  </tr>
                  <tr>
                    <td>款別</td>
                    <td>{{ invoiceItem.title }}</td>
                  </tr>
                  <tr>
                    <td>金額</td>
                    <td>{{ invoiceItem.amount }}</td>
                  </tr>
                  <tr>
                    <td>備註</td>
                    <td>{{ invoiceItem.comment }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-row class="mt-1">
                <v-col class="offset-3">總會計</v-col>
                <v-col>經收人</v-col>
              </v-row>
            </div>
            <div class="invoiceType">第三聯:收執聯</div>
          </div>
          
        </div>
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
      const printData = localStorage.getItem('printInvoiceData');
      this.printData = JSON.parse(printData);
      console.log(this.printData)
      // 每頁 16 個分組，分頁處理
      const itemsPerPage = 1;
      for (let i = 0; i < this.printData.length; i += itemsPerPage) {
        this.paginatedPrintData.push(this.printData.slice(i, i + itemsPerPage));
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
    convertDate(date) {
      const [year, month, day] = date.split('-');
      return `${parseInt(month)}月${day}日`;
    }
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
  flex: 1;
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
.border{
  border: 1px solid #333;
}
.tableContainer{
  width: 98%;
}
.print-item {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
}

.invoiceType{
  writing-mode: vertical-rl; /* 或 vertical-lr */
  text-orientation: upright;
  text-align: center;
  font-size: 0.875rem;
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
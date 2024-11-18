<template>
  <!-- 季刊=會勘=quarterly -->
  <v-form v-model="valid" v-if="!hasResult">
    
    <!-- 填寫註記 -->
    <v-row class="pa-4 justify-center">
      <v-col cols="4">
        <template v-for="(paymentItem, index) in paymentList">
          <div class="text-style mb-4 mt-8">註記名單{{ index + 1 }}</div>
          <v-row>
            <v-col cols="12">
              <div class="bold mb-2">繳費年度</div>
                <v-select
                v-model="paymentItem.paymentYear"
                hide-details="auto"
                :items="paymentYearList"
                placeholder="請選擇年度"
                clearable
                density="compact"
                variant="outlined"
                ></v-select>
            </v-col>

            <v-col cols="12">
              <div class="bold mb-2">會員級別</div>
                <v-select
                v-model="paymentItem.level"
                hide-details="auto"
                placeholder="請選擇級別"
                :items="levelList"
                clearable
                density="compact"
                variant="outlined"
                ></v-select>
            </v-col>

            <v-col cols="12">
              <div class="bold mb-2">會員名單</div>
              <v-text-field 
              v-model="paymentItem.dynamicText" 
              @input="dynamicSearch(paymentItem.dynamicText, index)"
              variant="outlined"
              placeholder="請輸入會員姓名或證號"
              :loading="paymentItem.textLoading"
              hide-details
              >
                <template v-for="selectedDynamicItem in paymentItem.frontUserIds">
                  <v-chip>
                    {{ selectedDynamicItem }}
                    <v-icon icon="mdi-close" end @click="removeSelectedDynamicItem(selectedDynamicItem, index)"></v-icon>
                  </v-chip>
                </template>

                <v-menu activator="parent">
                  <v-list v-if="dynamicList.length > 0">
                    <v-list-item
                    v-for="dynamicItem in dynamicList"
                    v-text="dynamicItem.frontUserId"
                    color="primary"
                    @click="addDynamicItem(dynamicItem, index)"
                    >
                    </v-list-item>
                  </v-list>
                  <v-list v-if="dynamicList.length === 0">
                    <v-list-item>
                      <v-list-item-title>目前無資料</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>  
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <div class="bold mb-2">備註（非必填）</div>
              <v-text-field
              v-model="paymentItem.comment"
              hide-details="auto"
              placeholder="請輸入備註"
              clearable
              density="compact"
              variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col>
            <v-btn flat color="#ececec" class="w-100" @click="addPaymentList()">
              <v-icon icon="mdi-plus"></v-icon>
              增加註記名單
            </v-btn>
          </v-col>

          <v-col cols="12" class="text-end">
            <v-btn class="mr-2" type="cancel" variant="outlined">取消</v-btn>
            <v-btn @click="submitPaymentCheck()" color="primary" variant="flat">發布</v-btn>
          </v-col>
        </v-row>
        
      </v-col>
    </v-row>
  </v-form>

  <!-- 註記結果 -->
  <v-row v-else class="pa-4 justify-center">
    <v-col cols="6">
      <div class="text-style mb-4">年費繳交註記結果</div>
      <v-table>
        <thead class="d-none">
          <tr>
            <th>繳費年度</th>
            <th>會員級別</th>
            <th>會員名單</th>
            <th>備註</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultItem in resultList">
            <td>{{ resultItem.paymentYear }}年度</td>
            <td>{{ resultItem.level }}</td>
            <td>{{ resultItem.frontUserId }}{{ resultItem.payerName }}</td>
            <td>
              <span v-if="resultItem.status === '成功'">
                <v-icon  icon="mdi-check-circle" color="#6FBE9F"></v-icon>
                {{ resultItem.message }}
              </span>
              <span v-else>
                <v-icon  icon="mdi-alert" color="#FF2424"></v-icon>
                {{ resultItem.message }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-row>
        <v-col class="text-right mt-4">
          <v-btn flat color="primary" class="mr-4">通訊標籤印製</v-btn>
          <v-btn flat color="primary" @click="PrintInvoice()">整批收據印製</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <LoadingComponent :loading="loading" />
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import paymentSrv from '@/service/payments.js'
import printSrv from '@/service/print.js'
import Swal from '@/utils/sweetAlert';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js'
import PrintInvoice from './PrintInvoice.vue';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      dynamicList: [],
      dynamicText: '',
      paymentList:[
        {
          paymentYear: '113',
          level: null,
          comment: '',
          dynamicText: '',
          frontUserIds:[],
          textLoading: false,
        },
      ],
      valid: false,
      loading: false,
      paymentYearList: ['113','112','111','110'],
      levelList: ['初級','正級','永級','電級','機級','工級','程級'],
      hasResult: false,
      resultList: [],
    }
  },
  methods: {
    submitPaymentCheck(){
      const paymentData = this.paymentList
      let html = ``
      for(let i = 0; i < paymentData.length; i++){
        html += this.convertHTML(paymentData[i], i)
      }
      
      Swal.fire({
        toast: true,
        position: 'center',
        title: `請再次確認註記名單`,
        confirmButtonColor: '#0E2A34',
        confirmButtonText: '確認',
        background: '#F0F0F2',
        width: 400,

        html: html

      }).then((result) => {
        if(result.isConfirmed){
          this.submitMember()
        }
      });
    },
    convertHTML(item, index){
      return `
        <div class="mb-4">
          <div class="bold" style="font-size: 20px; font-weight: 600; color: #1b2482;">註記名單${index + 1}</div>
          <div>
            <div class="bold mt-2">繳費年度</div>
            <div style="border: 1px solid #6E6E6E; padding: 4px; border-radius: 4px; width: 30%;">${item.paymentYear}</div>
          </div>
          <div>
            <div class="bold mt-2">會員級別</div> 
            <div style="border: 1px solid #6E6E6E; padding: 4px; border-radius: 4px; width: 30%;">${item.level}</div>
          </div>
          <div>
            <div class="bold mt-2">會員名單</div>
            <div style="border: 1px solid #6E6E6E; padding: 8px; border-radius: 8px; min-height: 30px;">
              ${item.frontUserIds.map(id => `<span style="background-color: rgba(27, 36, 130, 0.2); padding: 2px 4px;">${id}</span>`).join('')}
            </div>
          </div>
          <div>
            <div class="bold mt-2">備註</div>
            <div>${item.comment}</div>
          </div>
        </div>
      `
    },
    async submitMember(){
      this.loading = true

      try{
        const submitData = this.paymentList
        let resCount = 0

        for(let i = 0; i < submitData.length; i++){
          const obj = {
            frontUserIds: submitData[i].frontUserIds,
            paymentYear: submitData[i].paymentYear,
            level: submitData[i].level,
            comment: submitData[i].comment
          }
          paymentSrv.getPaymentList(obj).then((res) => {
            // api 回傳成功
            if (res.isSuccess) {
              // rtnCode 為 0000 的情況
              resCount++
              res.data.results.forEach(item => {
                this.resultList.push(item)
              })
              if(resCount === submitData.length){
                this.hasResult = true
              }
            } else {
              // api 回傳失敗
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
            }
          }).catch((error) => {
            // 處理錯誤情況
            console.error('Error:', error);
          }).finally(() => {
            // 無論成功或失敗都會執行，目前至少先關閉 loading，之後再依需求調整
            this.loading = false;
          });
        }
      }catch(error){
        Swal.fire({
          toast: true,
          position: 'center',
          title: `${error}`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
        this.loading = false
      }
    },
    async dynamicSearch(keyword, index) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout); // 重置計時器
      
      this.searchTimeout = setTimeout(async () => {

        if (keyword === '') {
          this.dynamicList = [];
          return;
        }
        
        try {
          this.paymentList[index].textLoading = true
          const res = await printSrv.dynamicSearch(keyword);

          // API 回傳成功
          if (res.isSuccess) {
            // 檢查 rtnCode 是否為 '0000'
            if (res.data.rtnCode === '0000') {
              this.dynamicList = res.data.data;
              // this.$refs.menuActivator.$el.click();
            }
          } else {
            // API 回傳失敗處理
            Swal.fire({
              toast: true,
              position: 'center',
              title: `${res.data.data.rtnMsg}`,
              confirmButtonColor: '#0E2A34',
              confirmButtonText: '確認',
              background: '#F0F0F2',
              width: 400,
            });
          }
        } catch (error) {
          // 處理錯誤情況
          console.error('Error:', error);
        } finally {
          this.paymentList[index].textLoading = false; // 關閉 loading
        }
      }, 500);
    },
    async getLevelList(){

    },  
    addDynamicItem(item, index){
      this.paymentList[index].frontUserIds.push(item.frontUserId)
      this.paymentList[index].dynamicText = ''
      this.dynamicList = []
    },
    removeSelectedDynamicItem(item, index){
      this.paymentList[index].frontUserIds = this.paymentList[index].frontUserIds.filter((selectedItem) => selectedItem !== item)
      // this.selectedDynamicList = this.selectedDynamicList.filter((selectedItem) => selectedItem !== item)
    },
    addPaymentList(){
      this.paymentList.push({
        paymentYear: '113',
        level: null,
        comment: '',
        dynamicText: '',
        frontUserIds: [],
        textLoading: false,
      })
    },
    PrintInvoice(){
      const printData = []
      this.resultList.forEach(item => {
        if(item.status === '成功'){
          printData.push(item)
        }
      })

      if(printData.length > 0){
        localStorage.setItem('printInvoiceData', JSON.stringify(printData));
        window.open('/admin/printInvoice', '_blank');
      }else{
        Swal.fire({
          toast: true,
          position: 'center',
          title: `無成功繳費資料`,
          confirmButtonColor: '#0E2A34',
          confirmButtonText: '確認',
          background: '#F0F0F2',
          width: 400
        });
      }
      
    },
    toPrev(){
      this.$router.push('/admin/Member');
    }
  }
}
</script>

<style scoped>
.text-red {
  color: crimson;
  font-weight: 900;
  margin-right: 4px;
}
.bold {
  font-size: 16px;
  font-weight: 700;
}

:deep(.v-selection-control--density-default) {
  --v-selection-control-size: 30px !important;
}
:deep(.v-selection-control__input) {
  align-items: center;
  display: flex;
  flex: none;
  justify-content: start;
  position: relative;
  border-radius: 50%;
  padding: 0px !important;
}
.custom-checkbox {
  height: 24px;
  line-height: 24px;
}
.end {
  justify-content: flex-end;
}

.text-style {
  font-size: 20px;
  font-weight: 600;
  color: #1b2482;
  padding: 4px;
  border-left: 8px solid #1b2482;
}
</style>

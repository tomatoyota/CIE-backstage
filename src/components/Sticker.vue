<template>
  <!-- 季刊=會勘=quarterly -->
  <v-form>
   
    
    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <v-row>

          <v-col cols="12">
            <v-radio-group v-model="dataType" hide-details>
              <v-radio label="年度" :value="1"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <v-select
                v-model="formData.year"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsListNumber"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">分會選擇</div>
            <v-row>
              <v-col cols="2" v-for="(branchItem, index) in branchList">
                <v-checkbox 
                v-model="formData.branchIds" 
                :value="branchItem.branchId" 
                :label="branchItem.level"
                :disabled="dataType !== 1"
                ></v-checkbox>  
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">級位</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.memberLevel"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="levelList"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">今年繳費註記</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.paymentStatus"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="branchList"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">近幾年曾繳費</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.paymentTrueYears"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">近幾年未繳費</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.paymentFalseYears"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">排序方式</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.sortField"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="sortList"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">選擇列印欄位</div>
            <v-row>
              <v-col cols="2" v-for="(fieldItem, index) in fieldList">
                <v-checkbox 
                v-model="formData.fields" 
                :value="fieldItem" 
                :label="fieldItem"
                hide-details
                :disabled="dataType !== 1"
                ></v-checkbox>  
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">會員資歷（依所選擇之基準日期往前推算）</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.setCreatedAt"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="createdAtList"
                item-title="name"
                item-value="value"
                variant="outlined"
                :disabled="dataType !== 1"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <Datepicker 
                :disabled="(formData.setCreatedAt === null || dataType !== 1) ? true : false" 
                v-model="formData.joinDateTo"
                :clearable="true" 
                :enableTimePicker="false" 
                :auto-apply="true"
                placeholder="請選擇基準日期"
                :day-names="[ '一', '二', '三', '四', '五', '六', '日' ]"
                :format="dateFormat"
                >
                  <template #month="{ text, value }">
                    {{ value + 1 }}月
                  </template>
                </Datepicker>
              </v-col>
            </v-row>
          </v-col>
          
          <v-col cols="12">
            <v-radio-group v-model="dataType" hide-details>
              <v-radio label="自填會員之標籤列印" :value="2"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12" class="position-relative">
            
            <v-text-field 
            v-model="dynamicText" 
            @input="dynamicSearch(dynamicText)"
            variant="outlined"
            placeholder="請輸入會員姓名或證號"
            :loading="textLoading"
            :disabled="dataType !== 2"
            >
              <template v-for="selectedDynamicItem in selectedDynamicList">
                <v-chip>
                  {{ selectedDynamicItem }}
                  <v-icon icon="mdi-close" end @click="removeSelectedDynamicItem(selectedDynamicItem)"></v-icon>
                </v-chip>
              </template>

              <v-menu activator="parent">
                <v-list v-if="dynamicList.length > 0">
                  <v-list-item
                  v-for="dynamicItem in dynamicList"
                  v-text="dynamicItem.frontUserId"
                  color="primary"
                  @click="addDynamicItem(dynamicItem)"
                  >
                  </v-list-item>
                </v-list>
              </v-menu>  
              
            </v-text-field>

            

            <!-- <v-card v-if="dynamicList.length > 0" class="dynamicCard" elevation="5">
              <v-list>
                <v-list-item
                v-for="dynamicItem in dynamicList"
                v-text="dynamicItem.frontUserId"
                color="primary"
                @click="addDynamicItem(dynamicItem)"
                >
                </v-list-item>
              </v-list>
            </v-card> -->
            
          </v-col>

          <v-col cols="12" class="text-end">
            <v-btn @click="printSticker()" color="primary" variant="flat">送出</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>

  <LoadingComponent :loading="loading" />
</template>

<script>
// import cities from '@/json/TwCities.json'
import { ref, computed, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import printSrv from '@/service/print.js'
import Swal from '@/utils/sweetAlert.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js'
import { storeToRefs } from 'pinia';
import { usePrintStore } from '@/stores/Print.js';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      tab: 1,
      branchList: [],
      fieldList: ['姓名','會員證號','級位', '分會', '繳註', '性別', '生日','服務機關', '現任職務', '行業別', '電話', '郵遞區號', '通訊地址', '電子郵件'],
      sortList:[
        {
          name: '分會',
          value: 'branch'
        },
      ],
      dynamicList: [],
      yearsListNumber:['113','112','111','110','109','108','107'],
      yearsList: [
        {
          name: '不設限',
          value: null
        },
        {
          name: '一',
          value: 1
        },
        {
          name: '二',
          value: 2
        },
        {
          name: '三',
          value: 3
        },
        {
          name: '四',
          value: 4
        },
        {
          name: '五',
          value: 5
        }
        
      ],
      createdAtList:[
        {
          name: '不設限',
          value: null
        },
        {
          name: '會籍滿一年',
          value: 1
        },
        {
          name: '會籍滿二年',
          value: 2
        },
        {
          name: '會籍滿三年',
          value: 3
        },
        {
          name: '會籍滿四年',
          value: 4
        },
        {
          name: '會籍滿五年',
          value: 5
        }
      ],
      levelList: ['初級','正級','永級','電級','機級','工級','程級'],
      formData: {
        year: '113',
        branchIds:[],
        memberLevel:'',
        paymentStatus: null,
        paymentTrueYears: null,
        paymentFalseYears: null,
        subscriptionStatus: '',
        joinDateFrom: '',
        joinDateTo: '',
        fields: [],
        sortField: '',
        sortOrder: '',
        memberInfo: [],
        setCreatedAt: null,
      },
      dataType: 1,
      loading: false,
      dynamicText: '',
      selectedDynamicList:[],
      searchTimeout: null, // 用於儲存計時器
      textLoading: false,
    }
  },
  mounted() {
    this.getBranchList()
    
  },
  watch:{
    'formData.setCreatedAt'(val){
      if(val === null){
        this.formData.joinDateTo = ''
      }
    }
  },
  methods: {
    setPage(){
      const action = this.$route.query.action
      this.pageAction = action
      if(action === 'add'){
        this.pageTitle = '新增會員'
      }else if(action === 'edit'){
        const store = usePersonalStore();
        const editDataStore = storeToRefs(store);
        const editData = editDataStore.editData.value
        this.pageTitle = `會員資料編輯-${editData.frontUserId}${editData.Individuals[0].chineseName}`
        this.formData = editData.Individuals[0]
      }
      this.$router.replace('/admin/personalView')
    },
    transformDate(date) {
      if (date) {
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()

        // 將月份和日期補0
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day

        return `${year}-${month}-${day}`
      }
      return ''
    },
    countDate(date) {
      const dateTo = this.transformDate(date);  // 將 date 轉換為目標格式
      const yearGap = this.formData.setCreatedAt; // 取得 yearGap
      
      // 從 dateTo 往回推 yearGap 年
      const targetDate = new Date(dateTo);
      targetDate.setFullYear(targetDate.getFullYear() - yearGap);
      
      const yearFrom = this.transformDate(targetDate)

      return yearFrom;
    },

    async getBranchList(){
      try{
        await dropSrv.getBranchList().then((res) => {
          if(res.isSuccess){
            this.branchList = res.data.data
          }
        }).catch((error) => {
          console.error('Error:', error);
        });
      }catch(error){
        console.log(error)
      }
    },
    async printSticker(){
      this.loading = true
      try{
        const obj = {
          year: this.dataType === 1 ? this.formData.year : '',
          branchIds: this.dataType === 1 ? this.formData.branchIds : '',
          memberLevel: this.dataType === 1 ? this.formData.memberLevel : '',
          paymentStatus: this.dataType === 1 ? this.formData.paymentStatus : '',
          paymentTrueYears: this.dataType === 1 ? this.formData.paymentTrueYears : '',
          paymentFalseYears: this.dataType === 1 ? this.formData.paymentFalseYears : '',
          subscriptionStatus: this.dataType === 1 ? this.formData.subscriptionStatus : '',
          joinDateFrom: this.dataType === 1 ? this.countDate(this.formData.joinDateTo) : '',
          joinDateTo: this.dataType === 1 ? this.transformDate(this.formData.joinDateTo) : '',
          fields: this.dataType === 1 ? this.formData.fields : '',
          memberKeywords: [],
          sortField: this.formData.sortField,
          sortOrder: this.formData.sortOrder,
        }
        
        // 如果選擇自填，會在這邊把 chips 裝進去 memberkeywords
        if(this.dataType === 2){
          this.selectedDynamicList.forEach(item => {
            obj.memberKeywords.push(item)
          })
        }

        // 如果是空的就把該 object key 刪除
        for (const key in obj) {
          const value = obj[key];
          if (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
            delete obj[key];
          }
        }
        
        printSrv.printSticker(obj).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              const printData = res.data.data
              localStorage.setItem('printData', JSON.stringify(printData));
              window.open('/admin/printPage', '_blank');

            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              });
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
    async dynamicSearch(keyword) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout); // 重置計時器
      
      this.searchTimeout = setTimeout(async () => {

        if (keyword === '') {
          this.dynamicList = [];
          return;
        }
        
        try {
          this.textLoading = true
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
          this.textLoading = false; // 關閉 loading
        }
      }, 500);
    },

    addDynamicItem(item){
      this.selectedDynamicList.push(item.frontUserId)
      this.dynamicText = ''
      this.dynamicList = []
    },
    removeSelectedDynamicItem(item){
      this.selectedDynamicList = this.selectedDynamicList.filter((selectedItem) => selectedItem !== item)
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

:deep(.v-input__control){
  flex-direction: row;
}
</style>

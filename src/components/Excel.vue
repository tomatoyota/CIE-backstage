<template>
  <!-- 季刊=會勘=quarterly -->

    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2">分會選擇</div>
            <v-row>
              <v-col cols="2" v-for="(branchItem, index) in branchList">
                <v-checkbox v-model="formData.branchIds" :value="branchItem.branchId" :label="branchItem.level"></v-checkbox>  
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
                :items="paymentStatusList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">近幾年曾繳費</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.yearsPaid"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">近幾年未繳費</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.yearsNotPaid"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="yearsList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">級位</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.level"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="levelList"
                item-title="name"
                item-value="level"
                variant="outlined"
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
                ></v-checkbox>  
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">排序欄位</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.sortField"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="fieldList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">排除條件</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.paymentStatus"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="fieldList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">會員資歷（依所選擇之基準日期往前推算）</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="setCreatedAt"
                placeholder="請選擇繳費狀況"
                density="compact"
                :items="createdAtList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="6">
                <Datepicker 
                :disabled="setCreatedAt === null" 
                v-model="formData.createdAtTo"
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

          <v-col cols="12" class="text-end">
            <v-btn @click="getExcel()" color="primary" variant="flat">匯出成 Excel</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

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
import { usePersonalStore } from '@/stores/PersonalMember.js';

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
      levelList: [],
      fieldList: ['姓名','會員證號','級位', '分會', '繳註', '性別', '生日','服務機關', '現任職務', '行業別', '電話', '郵遞區號', '通訊地址', '電子郵件'],
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
      paymentStatusList:[
        {
          name: '不設限',
          value: null
        },
        {
          name: '已繳費',
          value: 1
        },
        {
          name: '未繳費',
          value: 2
        }
      ],
      formData: {
        branchIds:[],
        paymentStatus: null,
        subscriptionStatus: '',
        level: null,
        yearsPaid: null,
        yearsNotPaid: null,
        createdAtFrom: '2024-10-11',
        createdAtTo: new Date(),
        fields: [],
        sortField: '',
        sortOrder: ''
      },
      setCreatedAt: null,
      loading: false,
      dateFormat: 'yyyy-MM-dd',
    }
  },
  mounted() {
    this.getBranchList()
    this.getPersonalLevelList()
    
  },
  watch:{
    setCreatedAt(val){
      if(val === null){
        this.formData.createdAtTo = ''
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
    async getPersonalLevelList(){
      this.loading = true
      try{
        await dropSrv.getPersonalLevelList().then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            this.levelList = [ {name:'不設限', level: null}, ...res.data.data]
            this.formData.level = null
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
      }
    },
    async getExcel(){
      this.loading = true
      try{
        const obj = {
          fileType: 'csv',
          branchIds: this.formData.branchIds,
          paymentStatus: this.formData.paymentStatus,
          subscriptionStatus: this.formData.subscriptionStatus,
          createdAtFrom: this.formData.createdAtFrom,
          createdAtTo: this.formData.createdAtTo,
          fields: this.formData.fields,
          sortField: 'created_at',
          sortOrder: 'DESC'
        }
        
        printSrv.getExcel(obj).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              Swal.fire({
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                confirmButtonColor: '#0E2A34',
                confirmButtonText: '確認',
                background: '#F0F0F2',
                width: 400
              }).then((result) => {
                if(result.isConfirmed){
                  this.$router.push('/admin/Member');
                }
              });
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

<template>
  <!-- 季刊=會勘=quarterly -->
  <v-form v-model="valid">
    <h2 class="pa-4">
      <span  @click="toPrev()" class="cursor-pointer">
        <v-icon>mdi-chevron-left</v-icon>
        {{ pageTitle }}
      </span>
    </h2>
    
    <v-row class="pa-4 justify-center">
      <v-col cols="6">

        <!-- 基本資料 -->
        <div class="text-style mb-4">基本資料</div>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2"><span class="text-red">*</span>會員證號</div>
                  <v-text-field
                  v-model="formData.frontUserId"
                  :rules="textFieldRule"
                  placeholder="請輸入會員證號"
                  clearable
                  density="compact"
                  variant="outlined"
                  :disabled="pageAction === 'edit'"
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2"><span class="text-red">*</span>團體中文名稱</div>
                  <v-text-field
                  v-model="formData.chineseName"
                  :rules="textFieldRule"
                  placeholder="請輸入團體中文名稱"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
              </v-col>
              <v-col cols="6">
                <div class="bold mb-2">團體英文名稱</div>
                  <v-text-field
                  v-model="formData.englishName"
                  hide-details="auto"
                  placeholder="請輸入團體英文名稱"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2"><span class="text-red">*</span>會員級別</div>
                <v-select
                v-model="formData.level"
                placeholder="請選擇會員級別"
                density="compact"
                :rules="selectRule"
                :items="groupLevelList"
                item-title="name"
                item-value="level"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2"><span class="text-red">*</span>所屬分會</div>
            <v-row>
              <v-col cols="6">
                <v-select
                v-model="formData.branch"
                placeholder="請選擇分會"
                density="compact"
                :rules="selectRule"
                :items="branchList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold mb-2"><span class="text-red">*</span>入會日期</div>
                <datepicker 
                v-model="formData.entryDate" 
                :clearable="true" 
                :enableTimePicker="false" 
                placeholder="請選擇日期" />
              </v-col>
              <v-col cols="4">
                <div class="bold mb-2"><span class="text-red">*</span>申請日期</div>
                <datepicker 
                v-model="formData.applicationDate" 
                :clearable="true" 
                :enableTimePicker="false" 
                placeholder="請選擇日期" />
              </v-col>
              <v-col cols="4">
                <div class="bold mb-2"><span class="text-red">*</span>核准日期</div>
                <datepicker 
                v-model="formData.approvalDate" 
                :clearable="true" 
                :enableTimePicker="false" 
                placeholder="請選擇日期" />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold mb-2"><span class="text-red">*</span>行業別</div>
                <v-select
                v-model="formData.industry"
                placeholder="請選擇分會"
                density="compact"
                :rules="selectRule"
                :items="industryList"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- 聯絡資料 -->
        <div class="text-style mb-4 mt-8">聯絡資料</div>
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2"><span class="text-red">*</span>主要通訊地址</div>
            <v-row>
              <v-col cols="4">
                <v-select
                v-model="formData.mainAddressCity"
                :rules="selectRule"
                placeholder="縣市"
                density="compact"
                :items="cityList"
                item-title="name"
                item-value="locationId"
                variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                v-model="formData.mainAddressDistrict"
                :rules="selectRule"
                placeholder="鄉鎮市區"
                density="compact"
                :items="districtList"
                item-title="name"
                item-value="locationId"
                variant="outlined"
                hide-details
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="formData.mainAddressPostal"
                hide-details="auto"
                placeholder="郵遞區號"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                v-model="formData.mainAddressDetail"
                :rules="textFieldRule"
                placeholder="請輸入道路名/街/里/巷弄號，如：中正路100號16樓之3"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2"><span class="text-red">*</span>主要聯絡電話</div>
            <v-text-field
            v-model="formData.mainPhone"
            :rules="textFieldRule"
            placeholder="手機範例：0900123987，市話範例：02-21113333"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">傳真電話</div>
            <v-text-field
            v-model="formData.fax"
            :rules="textFieldRule"
            placeholder="範例：02-21113333"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold mb-2">負責人姓名</div>
                <v-text-field
                v-model="formData.responsiblePersonName"
                :rules="textFieldRule"
                placeholder="請輸入負責人姓名"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <div class="bold mb-2">負責人職務</div>
                <v-text-field
                v-model="formData.responsiblePersonPosition"
                :rules="textFieldRule"
                placeholder="請輸入負責人職務"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">負責人電話</div>
            <v-text-field
            v-model="formData.responsiblePersonPhone"
            hide-details="auto"
            placeholder="請輸入負責人電話"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2"><span class="text-red">*</span>負責人電子郵件信箱</div>
            <v-text-field
            v-model="formData.responsiblePersonEmail"
            hide-details="auto"
            placeholder="請輸入負責人電子郵件信箱"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="4">
                <div class="bold mb-2">聯絡人姓名</div>
                <v-text-field
                v-model="formData.contactName"
                :rules="textFieldRule"
                placeholder="請輸入聯絡人姓名"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <div class="bold mb-2">聯絡人職務</div>
                <v-text-field
                v-model="formData.contactPosition"
                :rules="textFieldRule"
                placeholder="請輸入聯絡人職務"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">聯絡人電話</div>
            <v-text-field
            v-model="formData.contactPhone"
            hide-details="auto"
            placeholder="請輸入聯絡人電話"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">聯絡人電子郵件信箱</div>
            <v-text-field
            v-model="formData.contactEmail"
            hide-details="auto"
            placeholder="請輸入聯絡人電子郵件信箱"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

        </v-row>

        <!-- 會員代表 -->
        <template v-for="(repItem, index) in formData.representatives">
          <div class="text-style mb-4 mt-8">會員代表 {{ index + 1 }}</div>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="6">
                  <div class="bold mb-2">姓名</div>
                  <v-text-field
                  v-model="repItem.name"
                  :rules="textFieldRule"
                  placeholder="請輸入負責人姓名"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <div class="bold mb-2">職務</div>
                  <v-text-field
                  v-model="repItem.position"
                  :rules="textFieldRule"
                  placeholder="請輸入負責人職務"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <div class="bold mb-2">電話</div>
                  <v-text-field
                  v-model="repItem.phone"
                  :rules="textFieldRule"
                  placeholder="請輸入負責人職務"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <div class="bold mb-2">電子郵件信箱</div>
                  <v-text-field
                  v-model="repItem.email"
                  :rules="textFieldRule"
                  placeholder="請輸入負責人職務"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>  
        </template>

        <v-row>
          <v-col cols="12" class="text-end">
            <v-btn class="mr-2" @click="toPrev()" variant="outlined">取消</v-btn>
            <v-btn @click="submitMember()" color="primary" variant="flat">發布</v-btn>
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
import groupMemSrv from '@/service/groupMember.js'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js'
import { storeToRefs } from 'pinia';
import { useGroupStore } from '@/stores/GroupMember.js';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      textFieldRule: [
          (v) => !!v || '此欄位為必填',
      ],
      selectRule: [
          (v) => !!v || '此欄位為必填',
      ],
      branchList: ['台北分會', '高雄分會'],
      formData: {
        frontUserId: "",
        chineseName: "",
        englishName: "",
        level: null,
        branch: null,
        entryDate: "",
        applicationDate: "",
        approvalDate: "",
        industry: null,
        mainAddressCity: null,
        mainAddressDistrict: null,
        mainAddressPostal: "",
        mainAddressDetail: "",
        mainPhone: "",
        fax: "",
        responsiblePersonName: "",
        responsiblePersonPosition: "",
        responsiblePersonPhone: "",
        responsiblePersonEmail: "",
        contactName: "",
        contactPosition: "",
        contactPhone: "",
        contactEmail: "",
        paymentStatus: 1,
        passwordChange: 0,
        representatives:[
          {
            name:'',
            position:'',
            phone: '',
            email: ''
          },
          {
            name:'',
            position:'',
            phone: '',
            email: ''
          },
          {
            name:'',
            position:'',
            phone: '',
            email: ''
          },
          {
            name:'',
            position:'',
            phone: '',
            email: ''
          },
        ]
      },
      pageAction: 'add',
      pageTitle: '',
      branchList:[
        {
          name: '台北分會',
          value: 1
        },
        {
          name: '高雄分會',
          value: 2
        },
      ],
      cityList: [],
      secondaryCityList: [],
      districtList: [],
      secondaryDistrictList:[],
      valid: false,
      loading: false,
      groupLevelList: [],
      industryList:['製造業', '服務業', '金融業', '資訊業', '其他']
    }
  },
  mounted() {
    // this.initEditor()
    this.getLocationList()
    this.getGroupLevelList()
    
  },
  watch:{
    'formData.mainAddressCity': {
      handler(val) {
        const matchCity = this.cityList.find((city) => city.locationId === val)
        const districtList = matchCity.children
        const mainPostal = matchCity.postalCode
        this.districtList = districtList
        this.formData.mainAddressPostal = mainPostal
      },
      deep: true
    },
  },
  methods: {
    setPage(){
      const action = this.$route.query.action
      this.pageAction = action
      if(action === 'add'){
        this.pageTitle = '新增會員'
      }else if(action === 'edit'){
        const store = useGroupStore();
        const editDataStore = storeToRefs(store);
        const editData = editDataStore.editData.value
        console.log(editData)
        this.pageTitle = `會員資料編輯-${editData.frontUserId}${editData.Organizations[0].chineseName}`
        this.formData = editData.Organizations[0]
      }
      this.$router.replace('/admin/groupView')
    },
    getGroupLevelList(){
      dropSrv.getGroupLevelList().then((res) => {
        if(res.isSuccess){
          this.groupLevelList = res.data.data
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
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
    passwordGenerator() {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const digits = "0123456789";
      
      // 確保有 2 個大寫和 2 個小寫字母
      let upperLetters = "";
      let lowerLetters = "";
      while (upperLetters.length < 2) {
        const char = letters.charAt(Math.floor(Math.random() * 26) + 26); // 大寫字母
        if (!upperLetters.includes(char)) upperLetters += char;
      }
      while (lowerLetters.length < 2) {
        const char = letters.charAt(Math.floor(Math.random() * 26)); // 小寫字母
        if (!lowerLetters.includes(char)) lowerLetters += char;
      }
      
      // 生成 8 個隨機數字
      let randomDigits = "";
      for (let i = 0; i < 8; i++) {
        randomDigits += digits.charAt(Math.floor(Math.random() * digits.length));
      }
      
      // 組合密碼並打亂順序
      const password = (upperLetters + lowerLetters + randomDigits)
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
      
      return password;
    },
    async getLocationList(){
      try{
        await dropSrv.getLocationList().then((res) => {
          if(res.isSuccess){
            this.cityList = res.data.data
            this.setPage()
          }
        }).catch((error) => {
          console.error('Error:', error);
        });
      }catch{

      }
    },
    async submitMember(){
      this.loading = true
      try{
        const obj = {
          frontUserId: this.formData.frontUserId,
          chineseName: this.formData.chineseName || "",
          englishName: this.formData.englishName || "",
          level: this.formData.level || null,
          branch: this.formData.branch || null,
          entryDate: this.pageAction === 'add' ? this.transformDate(this.formData.entryDate) : this.formData.entryDate.split('T')[0],
          applicationDate: this.pageAction === 'add' ? this.transformDate(this.formData.applicationDate) : this.formData.applicationDate.split('T')[0],
          approvalDate: this.pageAction === 'add' ? this.transformDate(this.formData.approvalDate) : this.formData.approvalDate.split('T')[0],
          industry: this.formData.industry || "",
          mainAddressCity: this.formData.mainAddressCity || null,
          mainAddressDistrict: this.formData.mainAddressDistrict || null,
          mainAddressPostal: this.formData.mainAddressPostal || "",
          mainAddressDetail: this.formData.mainAddressDetail || "",
          mainPhone: this.formData.mainPhone || "",
          fax: this.formData.fax || "",
          responsiblePersonName: this.formData.responsiblePersonName || "",
          responsiblePersonPosition: this.formData.responsiblePersonPosition || "",
          responsiblePersonPhone: this.formData.responsiblePersonPhone || "",
          responsiblePersonEmail: this.formData.responsiblePersonEmail || "",
          contactName: this.formData.contactName || "",
          contactPosition: this.formData.contactPosition || "",
          contactPhone: this.formData.contactPhone || "",
          contactEmail: this.formData.contactEmail || "",
          paymentStatus: 0,
          passwordChange: 0,
          representatives: this.formData.representatives
        }

        const apiName = this.pageAction === 'add' ? 'postGroupMember' : 'putGroupMember'
        const id = obj.frontUserId
        groupMemSrv[apiName](obj, id).then((res) => {
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

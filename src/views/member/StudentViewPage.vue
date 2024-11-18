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
                <div class="bold mb-2"><span class="text-red">*</span>中文姓名</div>
                  <v-text-field
                  v-model="formData.chineseName"
                  :rules="textFieldRule"
                  placeholder="請輸入中文姓名"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
              </v-col>
              <v-col cols="6">
                <div class="bold mb-2">英文姓名</div>
                  <v-text-field
                  v-model="formData.englishName"
                  hide-details="auto"
                  placeholder="請輸入英文姓名"
                  clearable
                  density="compact"
                  variant="outlined"
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" v-if="pageAction === 'edit'">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2">會員級別</div>
                  <v-text-field
                  v-model="formData.level"
                  hide-details="auto"
                  placeholder="請輸入身分證字號"
                  clearable
                  density="compact"
                  variant="outlined"
                  disabled
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2">身分證字號</div>
                  <v-text-field
                  v-model="formData.idNumber"
                  hide-details="auto"
                  placeholder="請輸入身分證字號"
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
                <div class="bold mb-2"><span class="text-red">*</span>性別</div>
                <v-select
                v-model="formData.gender"
                :rules="selectRule"
                placeholder="請選擇性別"
                density="compact"
                :items="genderList"
                item-title="name"
                item-value="value"
                variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold mb-2"><span class="text-red">*</span>出生日期</div>
                <datepicker 
                v-model="formData.birthday" 
                :clearable="true" 
                :enableTimePicker="false" 
                placeholder="請選擇出生日期" />
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
            <div class="bold mb-2">次要通訊地址</div>
            <v-checkbox 
            v-model="followMainAddress"
            label="同主要通訊地址" 
            hide-details>
            </v-checkbox>
            <v-row>
              <v-col cols="4">
                <v-select
                v-model="formData.secondaryAddressCity"
                placeholder="縣市"
                density="compact"
                :items="secondaryCityList"
                item-title="name"
                item-value="locationId"
                variant="outlined"
                hide-details
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                v-model="formData.secondaryAddressDistrict"
                placeholder="鄉鎮市區"
                density="compact"
                :items="secondaryDistrictList"
                item-title="name"
                item-value="locationId"
                variant="outlined"
                hide-details
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="formData.secondaryAddressPostal"
                hide-details="auto"
                placeholder="郵遞區號"
                clearable
                density="compact"
                variant="outlined"
                readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                v-model="formData.secondaryAddressDetail"
                hide-details="auto"
                placeholder="請輸入道路名/街/里/巷弄號，如：中正路100號16樓之3"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">次要聯絡電話</div>
            <v-checkbox label="同主要聯絡電話" 
            v-model="followMainPhone"
            hide-details
            ></v-checkbox>
            <v-text-field
            v-model="formData.secondaryPhone"
            hide-details="auto"
            placeholder="請輸入次要聯絡電話"
            clearable
            density="compact"
            variant="outlined"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2"><span class="text-red">*</span>電子郵件信箱</div>
            <v-text-field
            v-model="formData.email"
            hide-details="auto"
            placeholder="請輸入電子郵件信箱"
            clearable
            density="compact"
            variant="outlined"
            >
              <template v-slot:append-inner>
                <v-btn color="primary" variant="text" :disabled="formData.email === ''" @click="verifyEmail()">
                    取得驗證碼
                </v-btn>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="6">
            <v-text-field
            v-model="verifyCode"
            hide-details="auto"
            placeholder="請輸入驗證碼"
            clearable
            density="compact"
            variant="outlined"
            >
              <template v-slot:append>
                <v-btn color="primary" variant="outlined" :disabled="formData.verifyCode === ''">
                    驗證
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- 其他資料 -->
        <div class="text-style mb-4 mt-8">其他資料</div>
        <v-row>
          <v-col cols="12">
            <div class="bold mb-2">最高學歷</div>
            <v-row>
              <v-col cols="4">
                <v-text-field
                v-model="formData.education"
                hide-details="auto"
                placeholder="學歷"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                v-model="formData.graduationYear"
                hide-details="auto"
                placeholder="畢業年份"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                v-model="formData.schoolMajor"
                hide-details="auto"
                placeholder="請輸入就讀學校與科系"
                clearable
                density="compact"
                variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold mb-2">是否寄送會刊與資料</div>
            <v-row no-gutters>
              <v-col cols="12">
                <v-checkbox 
                v-model="formData.magazineSubscription"
                label="不寄送會刊" 
                hide-details 
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <v-checkbox 
                v-model="formData.infoSubscription"
                label="不寄送資料"
                hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" class="text-end">
            <v-btn class="mr-2" type="cancel" variant="outlined">取消</v-btn>
            <v-btn @click="submitMember()" color="primary" variant="flat">發布</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>

  <LoadingComponent :loading="loading" />
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import studentSrv from '@/service/studentMember.js'
import Swal from '@/utils/sweetAlert';
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
      reduce: {
        type: Function,
        default: (option) => option
      },
      tab: 1,
      search: '',
      textFieldRule: [
          (v) => !!v || '此欄位為必填',
      ],
      selectRule: [
          (v) => !!v || '此欄位為必填',
      ],
      branchList: ['台北分會', '高雄分會'],
      formData: {
        frontUserId: "",
        password: "", 
        chineseName: "",
        englishName: "",
        idNumber: "",
        gender: null,
        birthday: "",
        mainAddressCity: null,
        mainAddressDistrict: null,
        mainAddressPostal: "",
        mainAddressDetail: "",
        mainPhone: "",
        secondaryAddressCity: null,
        secondaryAddressDistrict: null,
        secondaryAddressPostal: "",
        secondaryAddressDetail: "",
        secondaryPhone: "",
        email: "",
        education: "",
        graduationYear: "",
        schoolMajor: "",
        industry: "",
        company: "",
        position: "",
        entryDate: "",
        branch: null,
        level: null,
        paymentStatus: null,
        subscriptionStatus: "正常",
        magazineSubscription: null,
        infoSubscription: null,
        verifyCode: '',
      },
      followMainAddress: false,
      followMainPhone: false,
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
      genderList:[
        {
          name: '男',
          value: 1
        },
        {
          name: '女',
          value: 2
        }
      ],
      valid: false,
      loading: false,
    }
  },
  mounted() {
    // this.initEditor()
    this.getLocationList()
    
  },
  watch:{
    followMainAddress(val){
      if(val){
        this.formData.secondaryAddressCity = this.formData.mainAddressCity
        this.formData.secondaryAddressDistrict = this.formData.mainAddressDistrict
        this.formData.secondaryAddressPostal = this.formData.mainAddressPostal
        this.formData.secondaryAddressDetail = this.formData.mainAddressDetail
      }else{
        this.formData.secondaryAddressCity = null
        this.formData.secondaryAddressDistrict = null
        this.formData.secondaryAddressPostal = ""
        this.formData.secondaryAddressDetail = ""
      }
    },
    followMainPhone(val){
      if(val){
        this.formData.secondaryPhone = this.formData.mainPhone
      }else{
        this.formData.secondaryPhone = ""
      }
    },
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
    'formData.secondaryAddressCity': {
      handler(val) {
        const matchCity = this.secondaryCityList.find((city) => city.locationId === val)

        // 因為有同主要地址的checkbox，所以要判斷是否有matchCity，這樣 checkbox 才能順利切換
        if(matchCity){
          const districtList = matchCity.children
          const secondaryPostal = matchCity.postalCode
          this.secondaryDistrictList = districtList
          this.formData.secondaryAddressPostal = secondaryPostal
        }
      },
      deep: true
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
      this.$router.replace('/admin/studentView')
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
            this.secondaryCityList = res.data.data
            this.setPage()
          }
        }).catch((error) => {
          Swal.fire({
            toast: true,
            position: 'center',
            title: `${error}`,
            confirmButtonColor: '#0E2A34',
            confirmButtonText: '確認',
            background: '#F0F0F2',
            width: 400
          });
        });
      }catch{

      }
    },
    async verifyEmail(){
      try{
        const obj = {
          email: this.formData.email
        }
        await studentSrv.verifyEmail(obj).then((res) => {
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
          password: this.passwordGenerator(),
          chineseName: this.formData.chineseName,
          englishName: this.formData.englishName,
          idNumber: this.formData.idNumber,
          gender: parseInt(this.formData.gender),
          birthday: this.pageAction === 'add' ? this.transformDate(this.formData.birthday) : this.formData.birthday,
          mainAddressCity: this.formData.mainAddressCity,
          mainAddressDistrict: this.formData.mainAddressDistrict,
          mainAddressPostal: this.formData.mainAddressPostal,
          mainAddressDetail: this.formData.mainAddressDetail,
          mainPhone: this.formData.mainPhone,
          secondaryAddressCity: this.formData.secondaryAddressCity,
          secondaryAddressDistrict: this.formData.secondaryAddressDistrict,
          secondaryAddressPostal: this.formData.secondaryAddressPostal,
          secondaryAddressDetail: this.formData.secondaryAddressDetail,
          secondaryPhone: this.formData.secondaryPhone,
          email: this.formData.email,
          education: this.formData.education,
          graduationYear: this.formData.graduationYear,
          schoolMajor: this.formData.schoolMajor,
          subscriptionStatus: this.formData.subscriptionStatus,
          magazineSubscription: !this.formData.magazineSubscription  ? true : false,
          infoSubscription: !this.formData.infoSubscription ? true : false,
          verifyCode: this.formData.verifyCode
        }
        const apiName = this.pageAction === 'add' ? 'postMember' : 'putMember'
        const id = obj.frontUserId
        studentSrv[apiName](obj, id).then((res) => {
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

<template>
  <!-- 季刊=會勘=quarterly -->
   
  <v-form v-model="valid">
    <h2 class="pa-4">
      <span  @click="toPrev()" class="cursor-pointer">
        <v-icon>mdi-chevron-left</v-icon>
        {{pageTitle}}
      </span>
    </h2>
    
    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold">類別</div>
                <v-select
                v-model="selectedType"
                placeholder="選擇新增類別"
                density="compact"
                :items="['會刊', '學刊']"
                variant="outlined"
                hide-details
                readonly
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <div class="bold">標題</div>
              <v-text-field
              v-model="formData.title"
              :rules="rules"
              hide-details="auto"
              placeholder="請輸入學刊標題"
              clearable
              density="compact"
              variant="outlined"
              ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold">卷</div>
                <v-select
                v-model="formData.volume"
                placeholder="請輸入卷數"
                density="compact"
                :items="volumeList"
                variant="outlined"
                hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold">期</div>
                <v-select
                v-model="formData.issue"
                placeholder="請選擇期數"
                density="compact"
                :items="['1', '2', '3', '4']"
                variant="outlined"
                hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="bold">發行日期</div>
                <datepicker v-model="formData.releaseAt" :clearable="true" :enableTimePicker="false" placeholder="請選擇日期" />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <div class="bold">上傳學刊目錄圖片</div>
            <div class="d-flex align-center">
              <v-btn
              prepend-icon="mdi-upload"
              variant="outlined"
              density="comfortable"
              class="upload-btn"
              @click="triggerImageFileUpload"
              >
                點此上傳圖片
              </v-btn>

              <v-file-input
              class="d-none"
              ref="fileInput"
              accept="image/png, image/jpeg"
              hide-input
              show-size
              @change="onImageFileChange"
              ></v-file-input>

              <!-- 顯示圖片檔名及刪除按鈕 -->
              <div v-if="imageFileName" class="file-preview ml-4">
                {{ imageFileName }}
                <v-icon @click="removeImageFile('cover')" color="primary">mdi-close-circle</v-icon>
              </div>
            </div>
          </v-col>

          <v-col cols="12" class="text-end">
            <v-btn class="mr-2" variant="outlined" @click="toPrev()">取消</v-btn>
            <v-btn @click="callConfirm()" color="primary" variant="flat">發布</v-btn>
          </v-col>
        </v-row>
      </v-col>
      
    </v-row>
  </v-form>

  <LoadingComponent :loading="loading" />
  <ConfirmDialog :showConfirm="showConfirm" @submit="postAcademics"></ConfirmDialog>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import academicsSrv from '@/service/academics.js'
import dropdownSrv from '@/service/dropdowns.js'
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import Swal from '@/utils/sweetAlert';
import LoadingComponent from '@/components/LoadingComponent.vue';
import Quill from 'quill';
import ConfirmDialog from '@/components/ConfirmDialogComponent.vue';
import { storeToRefs } from 'pinia';
import { useAcademicStore } from '@/stores/academics.js';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
    ConfirmDialog
  },
  data() {
    return {
      reduce: {
        type: Function,
        default: (option) => option
      },
      tab: 1,
      search: '',
      rules: [
        // value => !!value || 'Required.',
        // value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      menu: false,
      locale: '',
      to: '',
      from: '',
      picked: '',
      pickedJoinDate: '',
      valid: false,
      imageFileName: '', // 儲存圖片檔名
      ebookFileName: '', // 儲存電子書檔名
      loading: false,
      title: '',
      formData: {
        title: '',
        volume: null,
        issue: null,
        releaseAt: '',
        imgOriginalName: '',
        imgRealName: '',

      },
      editor: null,
      selectedType: '學刊',
      showConfirm: false,
      pageTitle: '',
      volumeList:[],
    }
  },
  mounted() {
    this.getAcademicsVolume()
    this.setPageTitle()
  },
  watch: {
    picked(newVal) {
      if (newVal) {
        this.birthdate = this.transformDate(newVal)
      }
    }
  },
  methods: {
    setPageTitle(){
      const action = this.$route.query.action;
      let actionTitle = ''
      if(action === 'add'){
        actionTitle = '建立新發行'
      }else if(action === 'edit'){
        actionTitle = '學刊編輯'
        const store = useAcademicStore()
        const { editData } = storeToRefs(store);
        
        this.formData = editData
        this.imageFileName = decodeURIComponent(this.formData.image[0].originalFileName)
      }
      this.pageTitle = actionTitle
      this.$router.replace('/admin/academicView')
    },
    triggerImageFileUpload() {
      this.$refs.fileInput.click()
    },
    onImageFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFileName = file.name
        this.formData.imgOriginalName = file.name
      }
    },
    removeImageFile(fileType) {
      if(fileType === 'cover') {
        this.imageFileName = ''
        this.$refs.fileInput.reset()
      } else if(fileType === 'ebook') {
        this.ebookFileName = ''
        this.$refs.fileInputEbook.reset()
      }
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
    callConfirm(){
      Swal.fire({
        width: 600,
        toast: true,
        position: 'center',
        title: '確定要發布此學刊?',
        
        confirmButtonText: '確認',

        showCancelButton: true,
        cancelButtonText: '關閉',
        
      }).then((result) => {
        if(result.isConfirmed){
            this.postAcademics()
        }
      });
    },
    async getAcademicsVolume(){
      try{
        const obj = {
          title: this.title,
          volume: this.volume,
          issue: this.selectedIssue,
          releaseAt: this.releaseAt,
          imgOriginalName:'',
          imgRealName:'',
        }
        dropdownSrv.getAcademicsVolume(obj).then((res) => {
          if (res.isSuccess) {
            if(res.data.rtnCode === '0000'){
              this.volumeList = res.data.data
            }
          } else {
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
        }).catch((error) => {
          console.error('Error:', error);
        }).finally(() => {
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
    async uploadImage(){
      try{
        const obj = {
          title: this.title,
          volume: this.volume,
          issue: this.selectedIssue,
          releaseAt: this.releaseAt,
          imgOriginalName:'',
          imgRealName:'',
        }
        publicationSrv.postAssociation(obj).then((res) => {
          if (res.isSuccess) {
            if(res.data.rtnCode === '0000'){
              console.log(res)
              
            }else{
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
        }).catch((error) => {
          console.error('Error:', error);
        }).finally(() => {
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
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // 確保月份有兩位數
      const day = ('0' + date.getDate()).slice(-2); // 確保日期有兩位數
      return `${year}-${month}-${day}`;
    },
    async postAcademics(){
      this.loading = true
      try{
        const obj = {
          title: this.formData.title,
          volume: parseInt(this.formData.volume),
          issue: parseInt(this.formData.issue),
          releaseAt: this.formatDate(this.formData.releaseAt),
          imgOriginalName: this.formData.imgOriginalName,
          imgRealName: this.formData.imgRealName,
        }
        academicsSrv.postAcademics(obj).then((res) => {
          // api 回傳成功
          if (res.isSuccess) {
            // rtnCode 為 0000 的情況
            if(res.data.rtnCode === '0000'){
              Swal.fire({
                width: 600,
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                
                confirmButtonText: '確認',

                showCancelButton: true,
                cancelButtonText: '關閉',
                
              }).then((result) => {
                if(result.isConfirmed){
                    this.loading = false;
                    this.$router.push('/admin/publication')
                }
              });
            }else{
              // rtnCode 不為 0000 的情況
              Swal.fire({
                width: 600,
                toast: true,
                position: 'center',
                title: `${res.data.rtnMsg}`,
                
                confirmButtonText: '確認',

                showCancelButton: true,
                cancelButtonText: '關閉',
              });
            }
          } else {
            // api 回傳失敗
            Swal.fire({
              width: 600,
              toast: true,
              position: 'center',
              title: `${res.data.rtnMsg}`,
              
              confirmButtonText: '確認',

              showCancelButton: true,
              cancelButtonText: '關閉',
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
          width: 600,
          toast: true,
          position: 'center',
          title: `${res.data.rtnMsg}`,
          
          confirmButtonText: '確認',

          showCancelButton: true,
          cancelButtonText: '關閉',
        });
        this.loading = false;
      }
    },
    toPrev(){
      this.$router.push('/admin/publication');
    }
  }
}
</script>

<style scoped>
.gap {
  display: grid;
  gap: 12px;
}
.sm-width {
  width: 200px;
}
.text-red {
  color: crimson;
  font-weight: 900;
  margin-right: 4px;
}
.bold {
  font-size: 16px;
  font-weight: 700;
}

.row {
  display: flex;
  flex-direction: row;
}
.row-check {
  display: flex;
  flex-direction: row;
  /* align-content: center; */
  align-items: center;
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

.gap-content {
  display: grid;
  gap: 12px;
}

.custom-textarea {
  min-height: 100px;
  resize: vertical;
}
.custom-textarea-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.upload-btn {
  background-color: #fff;
  color: #1b2482;
  font-weight: 400;
  margin-top: 4px;
}
.file-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.file-preview v-icon {
  cursor: pointer;
  margin-left: 10px;
}
</style>

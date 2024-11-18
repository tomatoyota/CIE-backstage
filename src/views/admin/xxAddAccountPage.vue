<template>
  <div class=" pb-10 mb-10">
    <div class="title">新增會員</div>
    <div class="flex-container">
        <v-tabs v-model="tab" align-tabs="start" color="#22222">
          <v-tab :value="1">個人會員</v-tab>
          <v-tab :value="2" >團體會員</v-tab>
        </v-tabs>
      </div>
      <v-form v-model="formValidation">
        <div class="gap my-5">
              <div class="text-style">基本資料</div>
            <!-- 基本資料內容  -->
            <div class="gap-content pl-4">
              <div>
                <v-row>
                    <div class="text-red">*</div>
                    <div class="bold">會員證號</div>
                </v-row>
              </div>
                <div class="custom-container">
                  <div>
                  <v-row>
                    <div class="text-red">*</div>
                    <div class="bold">中文姓名</div>
                </v-row>
                  <v-text-field
                    :rules="rules"
                    hide-details="auto"
                    placeholder="請輸入中文姓名"
                    clearable
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </div>
                <div>
                  <div class="bold">英文姓名</div>
                  <v-text-field
                    :rules="rules"
                    hide-details="auto"
                    placeholder="請輸入英文姓名"
                    clearable
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </div>
                </div>
                
                
                
              
            </div>
              <div class="text-style">聯絡資料</div>
              <div class="text-style">其他資料</div>
        </div>
          <v-row>
              <v-col cols="6">
                <v-text-field
                  label="使用者帳號"
                  variant="outlined"
                  flat
                  v-model="accountName"
                  :rules="rules.notNull"
                  :disabled="isEdit"
                  >
              </v-text-field>
              </v-col>
              <v-col cols="6">
                  <v-text-field
                  v-model="userEmail"
                  flat
                  variant="outlined"
                  label="Email"
                  :rules="rules.userEmailFormat"
                  ></v-text-field>
              </v-col>
              <v-col cols="6" v-if="!isEdit">
                  <v-text-field
                  v-model="userPassword"
                  flat
                  variant="outlined"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  label="使用者密碼"
                  :rules="[rules.max, rules.min, rules.containsUppercase, rules.containsLowercase, rules.containsSpecialCharacter]"
                  @click:append="show = !show"
                  ></v-text-field>
              </v-col>
              <v-col cols="6">
                  <v-select
                  v-model="selectedRole"
                  :items="roleList"
                  item-title="roleName"
                  item-value="roleId"
                  variant="outlined"
                  label="角色"
                  multiple
                  >
              </v-select>
              </v-col>
              <v-col cols="6">
                  <v-select
                  v-model="selectedStatus"
                  :items="statusList"
                  item-title="label"
                  item-value="id"
                  variant="outlined"
                  label="狀態"
                  :rules="rules.select"
                  >
                  </v-select>
              </v-col>
          </v-row>
      </v-form>

      <div class="buttonGroup text-center mt-8">
          <v-btn
          flat
          color="normal"
          class="mr-2"
          @click="backToList()"
          >
              返回列表
          </v-btn>
          <v-btn
          v-if="!isEdit"
          flat
          class="mr-2"
          :color="!formValidation ? 'rgba(82,196,26, 0.4)' : 'success'"
          :disabled="!formValidation"
          @click="addAccount()"
          >
              送出
          </v-btn>
          <v-btn
          v-else
          flat
          class="mr-2"
          :color="!formValidation ? 'rgba(82,196,26, 0.4)' : 'success'"
          :disabled="!formValidation"
          @click="editAccount()"
          >
              送出
          </v-btn>
      </div>
  </div>
  
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import EditComponent from '@/components/EditWordTextComponent.vue';
import accountSrv from '@/service/account.js';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { isPlainObject } from '@tiptap/vue-3';
import { validateObject } from 'vee-validate';

export default {
  components:{
      EditComponent,
  },
  data() {
      return {
          
          isEdit: false,
          permissionList: [],
          selectedPermission:[],
          roleName: '',
          selectedStatus: null,
          show: false,
          statusList:[
              {
                  label: '啟用',
                  id: 0
              },
              {
                  label: '禁用',
                  id: 1
              }
          ],
          userPassword:'',
          roleList:[],
          selectedStatus: null,
          selectedRole: null,
          singleIP: '',
          rangeIPStart: '',
          rangeIPEnd: '',
          IPType:'1',
          accountName:'',
          userEmail:'',
          rules: {
              notNull: [(v) => !!v || '此欄位不得為空'],
              select: [(v) => v === 1 || v === 0 || '此欄位不得為空'],
              userEmailFormat: [(v) => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件地址'],
              min: (v) => v.length >= 10 || '密碼長度不足 10 個字元',
              max: (v) => v.length <= 16 || '密碼長度不可超過 16 個字元',
              containsUppercase: (v) => /[A-Z]/.test(v) || '密碼需包含至少一個大寫英文字母',
              containsLowercase: (v) => /[a-z]/.test(v) || '密碼需包含至少一個小寫英文字母',
              containsSpecialCharacter: (v) => /[!@#$%^&*]/.test(v) || '密碼需包含至少一個特殊符號，且僅包含 !@#$%^&* 等符號',
          },
          formValidation: false,
          validation: false,
      };
  },
  mounted(){
      
      this.getRole()
      this.getUserData()
  },
  
  methods:{
      
      getRole(){
          accountSrv.getRole().then((res) => {
              this.roleList = res.data
          })
      },
      addAccount(){
          const obj = {
              backendUserAccount: this.accountName,
              password: this.userPassword,
              roles: [],
              status: this.selectedStatus,
              email: this.userEmail
          }

          if(this.selectedRole && this.selectedRole.length > 0){
              this.selectedRole.forEach(i => {
                  obj.roles.push(i)
              })
          }

          accountSrv.addAccount(obj).then((res) => {
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
                      if (result.isConfirmed) {
                          this.$router.push('/admin/accountAdmin')
                      }
                  });
              }else{
                  Swal.fire({
                  toast: true,
                  position: 'center',
                  title: `${res.data.rtnMsg}`,
                  confirmButtonColor: '#0E2A34',
                  confirmButtonText: '確認',
                  background: '#F0F0F2',
                  width: 400
                  })
              }
          })
      },
      backToList(){
          this.$router.push('/admin/accountAdmin')
      },
      editAccount(){
          const obj = {
              backendUserAccount: this.accountName,
              roles: [],
              status: this.selectedStatus,
              email: this.userEmail
          }
          this.selectedRole.forEach(i => {
              obj.roles.push(i)
          })
          accountSrv.editAccount(obj).then((res) => {
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
                      if (result.isConfirmed) {
                          this.$router.push('/admin/accountAdmin')
                      }
                  });
              }else{
                  Swal.fire({
                      toast: true,
                      position: 'center',
                      title: `${res.data.rtnMsg}`,
                      confirmButtonColor: '#0E2A34',
                      confirmButtonText: '確認',
                      background: '#F0F0F2',
                      width: 400
                  })
              }
          })
      },
      getUserData(){
          const userData = JSON.parse(localStorage.getItem('userData'))
          if(userData){
              this.accountName = userData.account
              this.userEmail = userData.email
              this.selectedRole = []
              this.selectedStatus = userData.accountStatus
              this.isEdit = true
              userData.roles.forEach(i => {
                  this.selectedRole.push(i.roleId)
              })
          }
      }
  }
}

</script>
<style lang="scss" scoped>
.vh-100{
  min-height: calc(100vh - 48px);
}

.v-toolbar {
  background-color: transparent !important;
  padding: 3px 0;
  width: 600px;
  display: flex;
  align-items: center;
  height: 40px !important;
}

:deep(.v-input__control) {
  /* background-color: #DDDEEA !important; */
  min-height: 40px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
}

.search-theme {
  background-color: #dddeea;
  width: 600px;
  margin-bottom: 26px;
  padding-left: 10px;
  border-radius: 4px;
}

.title {
  font-size: 2.25rem; /* 36px */
  line-height: 56px;
  font-weight: 700;
  margin: 0px 0px 16px 0px;
}

.custom-btn {
  height: 48px;
  border-radius: 4px 4px 0px 0px;
  padding: 12px 24px 12px 24px;
  border-width: 1px 1px 0px 1px;
  margin-right: 7px !important;
}
.custom-btn:last-child {
  margin-right: 0 !important;
}

.custom-btn:focus,
.custom-btn.active {
  background-color: #222 !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

.v-tab {
  background-color: transparent !important;
  padding: 8px 16px 8px 16px;
}
.v-tabs--density-default {
  --v-tabs-height: 40px;
}

.v-tab-item--selected,
.v-tab--selected {
  background-color: transparent !important;
}


/* +++++++++++++++++++++++ */
.gap {
  display: grid;
  gap: 12px;
}
.custom-container {
  display: grid;
  /* flex-direction: column; */
  grid-template-columns: 200px 200px 200px;
  gap: 0.25rem; /* 4px */
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

.row-check {
  display: flex;
  flex-direction: row;
  /* align-content: center; */
  align-items: center;
}

.text-style {
  font-size: 20px;
  font-weight: 700;
  color: #1b2482;
  margin-left: 8px;
  border-left: 8px solid#1b2482;
  padding: 4px 8px 4px 8px;
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
  gap: 8px;
}
</style>

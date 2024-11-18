<template>
    <div class=" pb-10 mb-10">
        <v-form v-model="formValidation">
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
</style>
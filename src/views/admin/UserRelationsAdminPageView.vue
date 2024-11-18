<template>
    <div class=" pb-10 mb-10">
        <v-form v-model="validation">
            <v-row>
                <v-col>
                    <v-text-field label="審核群組名稱" variant="outlined" flat v-model="auditGroupName" :rules="rules.notNull"></v-text-field>
                </v-col>
                <v-col>
                    <v-select v-model="selectedAuditUserAccount" :items="userList" item-title="userAccount" item-value="userAccount" variant="outlined" label="審核者後台帳號" :rules="rules.select"></v-select>
                </v-col>
            </v-row>
        </v-form>
        <v-divider class="my-2"></v-divider>
        <h3 class="mt-4">資料管理者</h3>
        <v-row>
            <v-col cols="3" class="d-flex align-center" v-for="userItem in userList">
                <v-checkbox :label="userItem.userAccount" :value="userItem" v-model="selectedUser" hide-details></v-checkbox>
            </v-col>
        </v-row>
        <div class="buttonGroup text-center mt-8">
            <v-btn
            flat
            color="#F5F5F5"
            class="mr-2"
            @click="backToList()"
            >
                返回列表
            </v-btn>
            <v-btn
            v-if="!isEdit"
            color="success"
            class="mr-2"
            variant="flat"
            :disabled="!validation"
            @click="addRelations()"
            >
                送出
            </v-btn>
            <v-btn
            v-else
            color="success"
            class="mr-2"
            variant="flat"
            :disabled="!validation"
            @click="putRelations()"
            >
                送出
            </v-btn>
        </div>
    </div>
    
</template>

<script>
import { storeToRefs } from 'pinia';    
// import { useEditdbStore } from '@/stores/Editdatabase.js';
import EditComponent from '@/components/EditWordTextComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import userRelationsSrv from '@/service/userRelations.js';

export default {
    components:{
        EditComponent,
    },
    data() {
        return {
            isEdit: false,
            roleName: '',
            userList:[],
            validation: false,
            rules: {
                notNull: [(v) => !!v || '角色名稱不能為空'],
                select: [(v) => !!v || '審核者帳號不能為空']
            },
            auditGroupData: null,
            auditGroupName: '',
            auditUserAccount:'',
            selectedUser: [],
            selectedAuditUserAccount: null,
        };
    },
    mounted(){
        const isEdit = JSON.parse(localStorage.getItem('isEdit'))
        this.isEdit = isEdit
        if(isEdit === true){
            this.getEditUsers()
        }else{
            this.getUserList()
        }
    },  
    methods:{
        getUserList(){
            userRelationsSrv.getUserAccountList().then((res) => {
                const userData = res.data.data
                userData.forEach(i => {
                    const userAccount = {
                        userAccount: i.backend_user_account
                    }
                    this.userList.push(userAccount)
                })
            })
            
        },
        getEditUsers(){
            const userData = JSON.parse(localStorage.getItem('userData'))
            this.auditGroupData = userData.groupData
            this.auditGroupName = this.auditGroupData.auditGroupName
            this.selectedAuditUserAccount = this.auditGroupData.auditUserAccount
            userData.userData.forEach(i => {
                this.userList.push(i)
                if(i.isChecked === true){
                    this.selectedUser.push(i)
                }
            })
        },
        backToList(){
            this.$router.push('/admin/userRelations')
        },
        putRelations(){
            const obj = {
                auditGroupId: this.auditGroupData.auditGroupId,
                auditGroupName: this.auditGroupName,
                auditUserAccount: this.selectedAuditUserAccount,
                wordManagerUserAccounts: []
            }
            const selectedUsers = this.selectedUser
            selectedUsers.forEach(i => {
                obj.wordManagerUserAccounts.push(i.userAccount)
            })

            userRelationsSrv.putUserRelations(obj).then((res) => {
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
                            this.$router.push('/admin/userRelations')
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
        addRelations(){
            const obj = {
                auditGroupName: this.auditGroupName,
                auditUserAccount: this.selectedAuditUserAccount,
                wordManagerUserAccounts: []
            }
            const selectedUsers = this.selectedUser
            selectedUsers.forEach(i => {
                obj.wordManagerUserAccounts.push(i.userAccount)
            })
            userRelationsSrv.addUserRelations(obj).then((res) => {
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
                            this.$router.push('/admin/userRelations')
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
        }
    }
}

</script>
<style lang="scss" scoped>
.vh-100{
    min-height: calc(100vh - 48px);
}
.infoText{
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
    color: rgb(128, 128, 128)
}
.pageCheckbox{
    flex: none;
}
h3{
    font-weight: 900;
}
</style>
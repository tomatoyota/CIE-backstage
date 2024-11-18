<template>
    <div class=" pb-10 mb-10">
        <v-form v-model="validation">
            <v-row>
                <v-col>
                    <v-text-field label="角色名稱" variant="outlined" flat v-model="roleName" :rules="rules.notNull"></v-text-field>
                </v-col>
                <v-col>
                    <v-select v-model="selectedStatus" :items="statusList" item-title="label" item-value="id" variant="outlined" label="狀態" :rules="rules.select"></v-select>
                </v-col>
            </v-row>
        </v-form>
        <v-row v-if="isEdit">
            <v-col>
                <label class="d-block text-center">建立時間</label>
                <p class="infoText">{{ editData.roleInfo.createdAt.split('T')[0]}}</p>
            </v-col>
            <v-col>
                <label class="d-block text-center">建立者</label>
                <p class="infoText">{{ editData.roleInfo.creator }}</p>
            </v-col>
            <v-col>
                <label class="d-block text-center">修改時間</label>
                <p class="infoText">{{ editData.roleInfo.updatedAt.split('T')[0] }}</p>
            </v-col>
            <v-col>
                <label class="d-block text-center">修改者</label>
                <p class="infoText">{{ editData.roleInfo.editor || '無修改者' }}</p>
            </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
        <template v-for="permissionPages in permissionList">
            <v-row>
                <v-col cols="3" class="d-flex align-center">
                    <v-checkbox v-model="selectedPermission" class="pageCheckbox" :label="permissionPages.permissionName" :value="permissionPages.permissionId" hide-details @click.prevent="checkAll(permissionPages)"></v-checkbox>
                    <v-btn flat color="#F5F5F5" size="small" class="ml-2" @click="removeAllCheckbox(permissionPages)">全部清除</v-btn>
                    <v-btn flat color="warning" size="small" class="ml-2" @click="checkAllCheckbox(permissionPages)">全選</v-btn>
                </v-col>
            </v-row>
            <v-row class="mb-4">
                <v-col cols="3" v-for="permissionItem in permissionPages.children" class="py-0 pl-8">
                    <v-checkbox v-model="selectedPermission" :label="permissionItem.permissionName" :value="permissionItem.permissionId" hide-details @click.prevent="checkPage(permissionPages.permissionId, permissionItem.permissionId)"></v-checkbox>
                </v-col>
            </v-row>
        </template>
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
            flat
            :color="!validation || selectedPermission.length === 0 ? 'rgba(82,196,26, 0.4)' : 'success'"
            class="mr-2"
            :disabled="!validation || selectedPermission.length === 0"
            @click="addRole()"
            >
                儲存
            </v-btn>
            <v-btn
            v-else
            flat
            :color="!validation || selectedPermission.length === 0 ? 'rgba(82,196,26, 0.4)' : 'success'"
            class="mr-2"
            :disabled="!validation || selectedPermission.length === 0"
            @click="editRole()"
            >
                儲存
            </v-btn>
        </div>
    </div>
    <LoadingComponent :loading="loading"/>
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import EditComponent from '@/components/EditWordTextComponent.vue';
import roleSrv from '@/service/rolePermission.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';

export default {
    components:{
        EditComponent,
        LoadingComponent,
    },
    data() {
        return {
            isEdit: false,
            permissionList: [],
            selectedPermission:[],
            roleName: '',
            selectedStatus: null,
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
            roleEditData: null,
            editData: {
                creator: '',
                createdAt: '',
                edittor: '',
                updatedAt: ''
            },
            validation: false,
            rules: {
                notNull: [(v) => !!v || '角色名稱不能為空'],
                select: [(v) => v === 1 || v===0 || '狀態不能為空']
            },
            loading: false,
        };
    },
    mounted(){
        this.getPagesButton()
    },  
    methods:{
        checkPage(pageId, itemId){
            const matchPage = this.selectedPermission.find(i => i === pageId)
            const matchItem = this.selectedPermission.find(i => i === itemId)
            if(matchPage && !matchItem){
                this.selectedPermission.push(itemId)
            }else if(!matchPage && !matchItem){
                this.selectedPermission.push(pageId, itemId)
            }else if(matchItem){
                this.selectedPermission = this.selectedPermission.filter(i => i !== itemId)
            }
        },
        getPagesButton(){
            roleSrv.pagesButton().then((res) => {
                this.permissionList = res.data.data
                this.getEdit()
            })
        },
        checkAll(permissionPages){
            const selectedPermissions = this.selectedPermission
            const matchPage = selectedPermissions.find(i => i === permissionPages.permissionId)
            if(!matchPage){
                this.checkAllCheckbox(permissionPages)
            }else{
                this.removeAllCheckbox(permissionPages)
            }
        },
        checkAllCheckbox(item){
            this.selectedPermission.push(item.permissionId)
            if(item.children && item.children.length > 0){
                item.children.forEach(i => {
                    this.selectedPermission.push(i.permissionId)
                })
            }
        },
        removeAllCheckbox(item) {
            this.selectedPermission = this.selectedPermission.filter(id => id !== item.permissionId);
            if(item.children && item.children.length > 0){
                item.children.forEach(i => {
                    this.selectedPermission = this.selectedPermission.filter(id => id !== i.permissionId);
                })
            }
        },
        addRole(){
            this.loading = true
            const obj = {
                roleName: this.roleName,
                roleStatus: this.selectedStatus,
                permissions:[]
            }
            this.selectedPermission.forEach(i => {
                const permissionId = {
                    permission_id: i
                }
                obj.permissions.push(permissionId)
            })
            roleSrv.addRole(obj).then((res) => {
                this.loading = false
                if(res.isSuccess){
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
                            this.$router.push('/admin/rolePermissionAdmin')
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
            this.$router.push('/admin/rolePermissionAdmin')
        },
        getEdit(){
            this.roleEditData = JSON.parse(localStorage.getItem('rolePermissions'))
            const roleEditData = this.roleEditData
            if(roleEditData){
                this.isEdit = true
                this.roleName = this.roleEditData.roleInfo.roleName
                this.selectedStatus = this.roleEditData.roleInfo.status ? 0 : 1,
                roleEditData.permissions.forEach(i => {
                    this.selectedPermission.push(i.permissionId)
                })
                this.editData = roleEditData
            }
        },
        editRole(){
            this.loading = true
            const obj = {
                roleName: this.roleName,
                roleStatus: this.selectedStatus,
                permissions: this.selectedPermission
            }
            const id = this.roleEditData.roleInfo.roleId
            roleSrv.editRole(id, obj).then((res) => {
                this.loading = false
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
                            this.$router.push('/admin/rolePermissionAdmin')
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
</style>
<template>
    <div class=" pb-10 mb-10">
        <v-row>
            <v-col>
                <v-text-field label="角色名稱" variant="outlined" flat></v-text-field>
            </v-col>
            <v-col>
                <v-select label="狀態" variant="outlined" flat></v-select>
            </v-col>
        </v-row>
        <v-row v-if="isEdit">
            <v-col>
                <label>建立時間</label>
                <p></p>
            </v-col>
            <v-col>
                <label>建立者</label>
                <p></p>
            </v-col>
            <v-col>
                <label>修改時間</label>
                <p></p>
            </v-col>
            <v-col>
                <label>修改者</label>
                <p></p>
            </v-col>
            <v-col>
                <label>狀態</label>
                <p></p>
            </v-col>
        </v-row>
        <template v-for="permissionPages in permissionList">
            <v-row>
                <v-col cols="3">
                    <v-checkbox v-model="selectedPermission" :label="permissionPages.permissionName" :value="permissionPages.permissionId" hide-details @click.prevent="checkCheckbox(permissionPages)"></v-checkbox>
                </v-col>
            </v-row>
            <v-row class="mb-4">
                <v-col cols="3" v-for="permissionItem in permissionPages.buttons" class="py-0 pl-8">
                    <v-checkbox v-model="selectedPermission" :label="permissionItem.permissionName" :value="permissionItem.permissionId" hide-details @click="checkPage(permissionItem, permissionPages)"></v-checkbox>
                </v-col>
            </v-row>
        </template>
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
            color="success"
            class="mr-2"
            @click="addRole()"
            >
                送出
            </v-btn>
        </div>
    </div>
    
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import EditComponent from '@/components/EditWordTextComponent.vue'
import roleSrv from '@/service/rolePermission.js'

export default {
    components:{
        EditComponent,
    },
    data() {
        return {
            isEdit: false,
            permissionList: [],
            selectedPermission:[]
        };
    },
    mounted(){
        this.getPagesButton()
    },  
    methods:{
        getPagesButton(){
            roleSrv.pagesButton().then((res) => {
                this.permissionList = res.data.data.pages
            })
        },
        checkCheckbox(value) {
            const includePermission = this.selectedPermission.includes(value.permissionId);
            if (includePermission) {
                this.selectedPermission = this.selectedPermission.filter(id => id !== value.permissionId);
                value.buttons.forEach(button => {
                    this.selectedPermission = this.selectedPermission.filter(id => id !== button.permissionId);
                });
            } else {
                this.selectedPermission.push(value.permissionId);
                value.buttons.forEach(button => {
                    this.selectedPermission.push(button.permissionId);
                });
            }
        },
        checkPage(item, page) {
            const includeButtonPermission = this.selectedPermission.includes(item.permissionId);
            const includePagePermission = this.selectedPermission.includes(page.permissionId);
            const allButtonsIncluded = page.buttons.every(button => this.selectedPermission.includes(button.permissionId));

            if (includeButtonPermission && includePagePermission) {
                this.selectedPermission = this.selectedPermission.filter(id => id !== page.permissionId);
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
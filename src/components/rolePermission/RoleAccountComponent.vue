<template>
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">角色帳號</h5>
        </v-card-title>
        <v-card-text class="scroll-y">
            <div v-if="!userList.length" class="border-history py-5">
                <p class="text-center text-lightText mb-0">此角色未配給任何使用者</p>
            </div>
            <v-col class="tableInfo">
                <span>共{{ userList.length }}筆</span>
            </v-col>
            <v-table v-if="userList.length">
                <thead>
                    <tr>
                        <th class="text-left" style="width: 30px;"></th>
                        <th class="text-left">帳號</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(userItem, index) in userList" :key="userItem">
                        <th class="text-left">{{ index + 1 }}</th>
                        <th class="text-left">{{ userItem.backendUserAccount }}</th>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
                color="#F5F5F5"
                variant="flat"
                @click="closeList"
            >
                關閉
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';    
import { useEditdbStore } from '@/stores/Editdatabase.js';
import pinyinKeyboard from '@/components/PinyinComponent.vue';
import zhuyinKeyboard from '@/components/ZhuyinComponent.vue';
import removeDefinitionComponent from '@/components/database/removeDefinitionComponent.vue';
import removeImageComponent from '@/components/database/removeImageComponent.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import editSrv from '@/service/dataEdit.js';

    export default {
    emits: ['close-dialog'],
    props:{
        userList: Array,
    },
    
    data() {
        return {
            
        };
    },
    created(){
    },
    mounted(){
    },
    methods:{
        closeList(){
            this.$emit('close-dialog')
        }
    },
}
</script>

<style lang="scss" scoped>
.scroll-y{
    overflow-y: scroll;
}

.border-history {
    border: 1px solid rgba(#8c8c8c, .3);
}
</style>
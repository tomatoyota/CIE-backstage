<template>
    <!-- 先輸入 BO admin 密碼 -->
    <v-card v-model="BOPass" v-if="!BOPass">
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">請輸入 BO Admin 密碼</h5>
        </v-card-title>
        <v-card-text>
            <v-form v-model="validate">
                <v-text-field
                v-model="BOPassword"
                flat
                variant="outlined"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                label="輸入 BO Admin 密碼"
                :rules="[rules.required]"
                @click:append="show = !show"
                ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
            color="black"
            variant="tonal"
            class="font-weight-bold"
            @click="closeEdit"
            >
                取消
            </v-btn>
            <v-btn
            color="#1976D2"
            variant="flat"
            class="font-weight-bold"
            :loading="loading"
            @click="checkPassword"
            :disabled="!validate"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';
import { userAccountStore } from '@/stores/UserAccount.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import accountSrv from '@/service/account.js';
import IPSrv from '@/service/IP.js';

export default {
    props:{
        IPInfo: Number
    },
    data() {
        return {
            loading: false,
            show: false,
            BOPassword:'',
            newPassword: '',
            newPasswordAgain: '',
            BOPass: false,
            rules: {
                required: value => !!value || '密碼不可空',
                min: v => v.length >= 10 || '密碼長度不足 10 個字元',
                max: v => v.length <= 16 || '密碼長度不可超過 16 個字元',
                containsUppercase: v => /[A-Z]/.test(v) || '密碼需包含至少一個大寫英文字母',
                containsLowercase: v => /[a-z]/.test(v) || '密碼需包含至少一個小寫英文字母',
                containsSpecialCharacter: (v) => /[!@#$%^&*]/.test(v) || '密碼需包含至少一個特殊符號，且僅包含 !@#$%^&* 等符號',
                checkSame: v => v === this.newPassword || '與輸入的新密碼不同'
            },
            newPasswordValid: false,
            validate: false,
        };
    },
    methods:{
        closeEdit(){
            this.$emit('close-dialog')
        },
        checkPassword(){
            this.loading = true
            const obj = {
                password: this.BOPassword
            }
            accountSrv.checkBOPassword(obj).then((res) => {
                this.loading = false
                if(res.data.rtnCode === '0000'){
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `是否確定要刪除此 IP 設定?`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.deleteIP()
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
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.$emit('close-dialog');
                        }
                    });
                }
            })
        },
        deleteIP(){
            this.loading = true
            const id = this.IPInfo
            IPSrv.deleteIP(id).then((res) => {
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
                            this.$emit('close-dialog');
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
    },
}

</script>
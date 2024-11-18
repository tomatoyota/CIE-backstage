<template>
    <!-- 先輸入 BO admin 密碼 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">匯入字音對應表</h5>
        </v-card-title>
        <v-card-text>
            <v-file-input
            label="字詞音檔"
            variant="outlined"
            bg-color="white"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            @change="getExcel"
            ></v-file-input>
        </v-card-text>
        <v-card-actions class="ms-auto">
            <v-btn
            color="black"
            variant="tonal"
            class="font-weight-bold"
            @click="closeDialog"
            >
                取消
            </v-btn>
            <v-btn
            color="#1976D2"
            variant="flat"
            class="font-weight-bold"
            :loading="loading"
            @click="importExcel"
            :disabled="!validate"
            >
                送出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js';
import phoneticSrv from '@/service/phonetics.js';

export default {
    props:{
        IPInfo: Number
    },
    data() {
        return {
            loading: false,
            show: false,
            validate: false,
            excelFile: null,
        };
    },
    methods:{
        closeDialog(){
            this.$emit('close-dialog')
        },
        getExcel(){
            const file = event.target.files[0]
            this.excelFile = file
            this.validate = true
        },
        importExcel(){
            this.loading = true
            const file = this.excelFile
            const formData = new FormData
            formData.append('file', file)
            phoneticSrv.importExcel(formData).then((res) => {
                this.loading =  false
                if(res.data.rtnCode === '0000'){
                    Swal.fire({
                        toast: true,
                        icon: 'success',
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
                        icon: 'fail',
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
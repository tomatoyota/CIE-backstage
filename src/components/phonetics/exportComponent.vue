<template>
    <!-- 先輸入 BO admin 密碼 -->
    <v-card>
        <v-card-title class="bg-dialog-title py-4">
            <h5 class="font-weight-bold text-h3 mb-0">匯出字音對應表</h5>
        </v-card-title>
        <v-card-text>
            <v-select
            label="請選擇匯出格式"
            variant="outlined"
            :items="['xlsx', 'csv']"
            v-model="selectedExportType"
            >
            </v-select>
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
            @click="exportExcel"
            >
                匯出
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Swal from 'sweetalert2/dist/sweetalert2.js';
import phoneticSrv from '@/service/phonetics.js';

export default {
    props:{
        selectedPinyin: String
    },
    data() {
        return {
            loading: false,
            show: false,
            validate: false,
            excelFile: null,
            selectedExportType: 'xlsx',
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
        exportExcel() {
            this.loading = true;
            const fileType = this.selectedExportType;
            const pinyin = this.selectedPinyin;
            phoneticSrv.exportExcel(fileType, String(pinyin)).then((res) => {
                this.loading = false;
                if (res.isSuccess) {
                    const blob = new Blob([res.data], { type: res.data.type['type'] });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    const fileExtension = fileType === 'xlsx' ? 'xlsx' : 'csv';
                    link.setAttribute('download', `字音對應表.${fileExtension}`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    this.$emit('close-dialog');
                } else {
                    Swal.fire({
                        toast: true,
                        icon: 'error',
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    });
                }
            });
        }
    },
}

</script>
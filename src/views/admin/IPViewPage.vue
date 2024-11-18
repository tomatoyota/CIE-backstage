<template>
    <div class=" pb-10 mb-10">
        <v-row>
            <v-col>
                <v-text-field v-model="IPname" label="IP 區段名稱" variant="outlined" flat></v-text-field>
            </v-col>
        </v-row>
        
        <v-radio-group v-model="IPtype">
            <v-row>
                <v-radio value="1"></v-radio>
                <v-col>
                    <v-text-field v-model="singleIP" label="單一 IP" variant="outlined" flat hide-details :disabled="IPtype === '2'"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-radio value="2"></v-radio>
                <v-col>
                    <v-text-field v-model="ipStart" label="起始 IP" variant="outlined" flat hide-details :disabled="IPtype === '1'"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model="ipEnd" label="結束 IP" variant="outlined" flat hide-details :disabled="IPtype === '1'"></v-text-field>
                </v-col>
            </v-row>
        </v-radio-group>
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
            @click="postIP()"
            >
                送出
            </v-btn>
            <v-btn
            v-else
            flat
            color="success"
            class="mr-2"
            @click="putIP()"
            >
                送出
            </v-btn>
        </div>
    </div>
    
</template>

<script>
import IPSrv from '@/service/IP.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default {
    components:{
    },
    data() {
        return {
            isEdit: false,
            IPname: '',
            IPtype: '',
            singleIP: '',
            ipStart: '',
            ipEnd: '',
            editData: null,
        };
    },
    mounted(){
        const ipData = JSON.parse(localStorage.getItem('ipData'))
        const isEdit = JSON.parse(localStorage.getItem('isEdit'))
        if(isEdit){
            this.isEdit = isEdit
        }
        // 如果有修改資料
        if(ipData){
            this.IPname = ipData.name
            this.singleIP = ipData.singleIp || ''
            this.ipStart = ipData.ipStart || ''
            this.ipEnd = ipData.ipEnd || ''
            this.IPid = ipData.whitelistId
            if(this.singleIP !== ''){
                this.IPtype = '1'
            }else{
                this.IPtype = '2'
            }
        }else{
            // 如果沒有修改資料
            this.IPtype = '1'
        }
    },
    methods:{
        backToList(){
            this.$router.push('/admin/IPAdmin')
        },
        postIP(){
            const obj = {
                name: this.IPname,
                singleIp: this.IPtype === '1' ? this.singleIP : '',
                ipStart: this.IPtype === '2' ? this.ipStart : '',
                ipEnd: this.IPtype === '2' ? this.ipEnd : '',
            }
            for (const key in obj) {
                if (obj[key] === '' ) {
                    delete obj[key];
                }
            }
            IPSrv.postIP(obj).then((res) => {
                if(res.isSuccess){
                    if( res.data.rtnCode === '0000'){
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
                                this.$router.push('/admin/IPAdmin')
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
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
                        confirmButtonColor: '#0E2A34',
                        confirmButtonText: '確認',
                        background: '#F0F0F2',
                        width: 400
                    })
                }
            })
        },
        putIP(){
            const obj = {
                name: this.IPname,
                singleIp: this.IPtype === '1' ? this.singleIP : '',
                ipStart: this.IPtype === '2' ? this.ipStart : '',
                ipEnd: this.IPtype === '2' ? this.ipEnd : '',
            }
            for (const key in obj) {
                if (obj[key] === '' ) {
                    delete obj[key];
                }
            }
            const id = this.IPid
            IPSrv.putIP(id, obj).then((res) => {
                if(res.isSuccess){
                    if( res.data.rtnCode === '0000'){
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
                                this.$router.push('/admin/IPAdmin')
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
                }else{
                    Swal.fire({
                        toast: true,
                        position: 'center',
                        title: `${res.msg}`,
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
</style>
<template>
    <div class=" pb-10 mb-10">
        <v-row>
            <v-col class="position-relative">
                <v-text-field v-model="pinyin" hint="請在字跟字之間加上逗號或空白" :persistent-hint="true" :value="transformComma(pinyin)" variant="outlined" label="漢語拼音"  bg-color="white" append-inner-icon="mdi mdi-keyboard-outline" @click:append-inner="togglePinyinKeyboard()"></v-text-field>
                <pinyinKeyboard v-if="showPinyinKeyboard" @text-updated="joinPinyin" @close-keyboard="closePinyinKeyboard(item)" :originalText="originalPinyin"></pinyinKeyboard>
            </v-col>
            <v-col class="position-relative">
                <v-text-field v-model="zhuyin" hint="請在字跟字之間加上逗號或空白" :persistent-hint="true" :value="transformComma(zhuyin)" @input="zhuyinInput" variant="outlined" label="注音"  bg-color="white" append-inner-icon="mdi mdi-keyboard-outline" @click:append-inner="toggleZhuyinKeyboard()"></v-text-field>
                <zhuyinKeyboard v-if="showZhuyinKeyboard" @text-updated="joinZhuyin" @close-keyboard="closeZhuyinKeyboard(item)" :originalText="originalZhuyin"></zhuyinKeyboard>
            </v-col>
        </v-row>
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
            @click="postPhonetics()"
            >
                送出
            </v-btn>
            <v-btn
            v-else
            flat
            color="success"
            class="mr-2"
            @click="putPhonetics()"
            >
                送出
            </v-btn>
        </div>
    </div>
    <!-- <pinyinKeyboard v-if="showPinyinKeyboard" @text-updated="joinPinyin" @close-keyboard="closePinyinKeyboard(item)" :originalText="originalPinyin"></pinyinKeyboard> -->
    <!-- <zhuyinKeyboard v-if="showZhuyinKeyboard" @text-updated="joinZhuyin" @close-keyboard="closeZhuyinKeyboard(item)" :originalText="originalZhuyin"></zhuyinKeyboard> -->
</template>

<script>
import phoneticSrv from '@/service/phonetics.js';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import pinyinKeyboard from '@/components/PinyinComponent.vue';
import zhuyinKeyboard from '@/components/ZhuyinComponent.vue';

export default {
    components:{
        pinyinKeyboard,
        zhuyinKeyboard,
    },
    data() {
        return {
            isEdit: false,
            pinyin:'',
            zhuyin:'',
            originalPinyin: '',
            originalZhuyin: '',
            editData: null,
            showPinyinKeyboard: false,
            showZhuyinKeyboard: false,
        };
    },
    mounted(){
        const phoneticsData = JSON.parse(localStorage.getItem('phoneticsData'))
        const isEdit = JSON.parse(localStorage.getItem('isEdit'))
        
        if(isEdit){
            this.isEdit = isEdit
        }
        if(phoneticsData){
            this.pinyin = phoneticsData.pinyin
            this.zhuyin = phoneticsData.zhuyin
            this.originalPinyin = this.pinyin
            this.originalZhuyin = this.zhuyin
            this.id = phoneticsData.pronunciation_id
        }
    },
    methods:{
        backToList(){
            this.$router.push('/admin/phonetics')
        },
        postPhonetics(){
            const obj = {
                pinyin: this.pinyin,
                zhuyin: this.zhuyin,
            }
            phoneticSrv.postPhonetics(obj).then((res) => {
                if(res.isSuccess){
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
                                this.$router.push('/admin/phonetics')
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
        putPhonetics(){
            const obj = {
                pinyin: this.pinyin,
                zhuyin: this.zhuyin,
            }
            const id = this.id
            phoneticSrv.putPhonetics(id, obj).then((res) => {
                if(res.isSuccess){
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
                                this.$router.push('/admin/phonetics')
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
        togglePinyinKeyboard(value){
            if(this.showZhuyinKeyboard){
                this.showZhuyinKeyboard = false
            }
            this.showPinyinKeyboard = !this.showPinyinKeyboard
            this.currentPinyin = value
        },
        toggleZhuyinKeyboard(value){
            if(this.showPinyinKeyboard){
                this.showPinyinKeyboard = false
            }
            this.showZhuyinKeyboard = !this.showZhuyinKeyboard
            this.currentZhuyin = value
        },
        transformComma(value) {
            if (value) {
                const commaCount = (value.match(/,/g) || []).length; // 計算逗號的數量
                if (commaCount > 1) {
                // 情況一：移除最後一個逗號
                const lastCommaIndex = value.lastIndexOf(', ');
                return value.substring(0, lastCommaIndex) + value.substring(lastCommaIndex + 1);
                } else if (commaCount === 1 && value.endsWith(', ')) {
                // 情況二：移除逗號
                return value.replace(/, $/, '');
                } else {
                // 情況三：不移除逗號
                return value;
                }
            }
            return value;
        },
        joinPinyin(item) {
            this.pinyin = item.join('')
        },
        joinZhuyin(item) {
            this.zhuyin = item.join('');
        },
        closePinyinKeyboard(){
            this.showPinyinKeyboard = false;
            // const currentPinyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentPinyin)
            // this.transformPinyin(currentPinyin)
        },
        closeZhuyinKeyboard(){
            this.showZhuyinKeyboard = false;
            // const currentZhuyin = this.wordDetail.editDefinitions.find(d => d.sequence === this.currentZhuyin)
            // this.transformZhuyin(currentZhuyin)
        },
    }
}

</script>
<style lang="scss" scoped>
.vh-100{
    min-height: calc(100vh - 48px);
}
</style>
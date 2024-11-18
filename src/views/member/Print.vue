<template>
    <v-tabs v-model="tab" align-tabs="start" color="#22222">
      <v-tab :value="1">會員名冊</v-tab>
      <v-tab :value="2">通訊標籤</v-tab>
    </v-tabs>
    <excelComponent v-if="tab === 1"></excelComponent>
    <stickerComponent v-else></stickerComponent>

</template>

<script>
import { storeToRefs } from 'pinia';
import { usePersonalStore } from '@/stores/PersonalMember.js';
import excelComponent from '@/components/Excel.vue';
import stickerComponent from '@/components/Sticker.vue';


export default {
  setup() {
   
  },
  components: {
    excelComponent,
    stickerComponent,
  },
  data() {
    return {
      tab: 1,
      loading: false,
    }
  },
  mounted() {
    
  },
  watch:{
    
  },
  methods: {
    setPage(){
      const action = this.$route.query.action
      this.pageAction = action
      if(action === 'add'){
        this.pageTitle = '新增會員'
      }else if(action === 'edit'){
        const store = usePersonalStore();
        const editDataStore = storeToRefs(store);
        const editData = editDataStore.editData.value
        this.pageTitle = `會員資料編輯-${editData.frontUserId}${editData.Individuals[0].chineseName}`
        this.formData = editData.Individuals[0]
      }
      this.$router.replace('/admin/personalView')
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

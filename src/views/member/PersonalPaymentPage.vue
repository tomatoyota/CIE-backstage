<template>
  <!-- 季刊=會勘=quarterly -->
  <v-form>
    <h2 class="pa-4">
      <span  @click="toPrev()" class="cursor-pointer">
        <v-icon>mdi-chevron-left</v-icon>
        {{ pageTitle }}
      </span>
    </h2>
    
    <v-row class="pa-4 justify-center">
      <v-col cols="6">
        <v-table>
          <thead>
            <tr>
              <template v-for="headerItem in headers">
                <th :width="headerItem.width" class="text-left">
                  {{ headerItem.name }}
                </th>    
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-if="paymentData && paymentData.length > 0">
              <tr v-for="item in paymentData" :key="item.id">
                <td>{{ item.paymentYear }}</td>
                <td>{{ convertLevel(item.level) }}</td>
                <td>{{ item.comment }}</td>
              </tr>    
            </template>
            <template v-else>
                <tr >
                  <td colspan="3" class="text-center"><h3 class="ma-0"><strong>無紀錄</strong></h3></td>
                </tr>
            </template>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
// import cities from '@/json/TwCities.json'
import { ref, computed, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import personalMemSrv from '@/service/personalMember.js'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import LoadingComponent from '@/components/LoadingComponent.vue';
import dropSrv from '@/service/dropdowns.js'
import { storeToRefs } from 'pinia';
import { usePersonalStore } from '@/stores/PersonalMember.js';

export default {
  setup() {
   
  },
  components: {
    Datepicker,
    LoadingComponent,
  },
  data() {
    return {
      pageTitle: '',
      headers: [
        {
          name: '年度',
          width: '20%',
        },
        {
          name: '繳費級別',
          width: '20%',
        },
        {
          name: '備註',
          width: '20%',
        }
      ],
      paymentData:[],
    }
  },
  mounted() {
    this.setPage()
  },
  methods: {
    setPage(){
      const store = usePersonalStore();
      const {paymentData, userData} = storeToRefs(store);
      
      this.paymentData = paymentData.value;
      this.pageTitle = `繳費紀錄-${userData.value.frontUserId}${userData.value.chineseName}`
    },
    
    toPrev(){
      this.$router.push('/admin/Member');
    },
    convertLevel(status){
      switch(status){
        case 1:
          return '初級'
        case 2:
          return '正級'
        case 3:
          return '永級'
        default:
          return ''
      }
    },
  }
}
</script>

<style scoped>
.text-red {
  color: crimson;
  font-weight: 900;
  margin-right: 4px;
}
.bold {
  font-size: 16px;
  font-weight: 700;
}

:deep(.v-selection-control--density-default) {
  --v-selection-control-size: 30px !important;
}
:deep(.v-selection-control__input) {
  align-items: center;
  display: flex;
  flex: none;
  justify-content: start;
  position: relative;
  border-radius: 50%;
  padding: 0px !important;
}
.custom-checkbox {
  height: 24px;
  line-height: 24px;
}
.end {
  justify-content: flex-end;
}

.text-style {
  font-size: 20px;
  font-weight: 600;
  color: #1b2482;
  padding: 4px;
  border-left: 8px solid #1b2482;
}
</style>

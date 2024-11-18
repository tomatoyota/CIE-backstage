<template>
  <div class="flex-container">
  <v-tabs v-model="tab" align-tabs="start" color="#22222">
    <v-tab :value="1">個人會員</v-tab>
    <v-tab :value="2">團體會員</v-tab>
    <v-tab :value="3">學生會員入會審查</v-tab>
  </v-tabs>
  <!-- <v-btn flat class="addBtn" @click="goToMember_add" >新增會員</v-btn> -->
</div>

  <div class="custom-table">
    <PersonalAdminPage v-if="tab === 1" />
    <GroupAdminPage v-if="tab === 2" />
    <StudentAdminPage v-if="tab === 3" />
  </div>
</template>

<script>
import { defineComponent, ref,watch } from 'vue'
import { useSelectedItemsStore } from '@/stores/SelectedTable'

import PersonalAdminPage from '@/views/member/PersonalAdminPage.vue'
import GroupAdminPage from '@/views/member/GroupAdminPage.vue'
import StudentAdminPage from '@/views/member/StudentAdminPage.vue'

export default {
components: {
  PersonalAdminPage,
  GroupAdminPage,
  StudentAdminPage,
},

setup() {
    const selectedItemsStore = useSelectedItemsStore()
    const tab = ref(selectedItemsStore.selectedTab);
    watch(tab, (newTab) => {
      selectedItemsStore.setSelectedTab(newTab);
    });
   
    

    return {
      tab,
    }
  },

data() {
return {

  search: '',

  page: 1,
  pages: 10
}
},


methods: {
goToMember_add() {
  this.$router.push('/addmember')
},
getStatusClass(status) {
  return status === '已繳費' ? 'paid' : 'unpaid'
},
editItem(item) {
  // 编辑逻辑
},
chargeItem(item) {
  // 繳費紀錄逻辑
},
deleteItem(item) {
  // 删除逻辑
}
},
handleButtonClick(buttonId) {
this.activeButton = buttonId
},

checkCheckbox() {
if (this.checkAllItem) {
  this.checkItem = this.tableItems.map((item) => item.id)
} else {
  this.checkItem = []
}
},
sortDBList(header) {
// 排序邏輯
},
getStatusClass(status) {
return {
  'text-success': status === '已編輯',
  'text-error': status !== '已編輯'
}
},
transferStatus(status) {
return status === '已編輯' ? '已編輯' : '未編輯'
},
formatDate(date) {
return date
},
previewWord(item) {
// 預覽邏輯
},
editWord(item) {
// 編輯邏輯
},
returnToAllDatabaseView(item) {
// 返回總資料庫邏輯
},
historyView(wordId) {
// 查看歷程邏輯
},
deleteView(item) {
// 刪除邏輯
}
}
</script>

<style scoped>

.title {
font-size: 2.25rem; /* 36px */
line-height: 56px;
font-weight: 700;
margin: 0px 0px 16px 0px;
}

.custom-btn {
height: 48px;
border-radius: 4px 4px 0px 0px;
padding: 12px 24px 12px 24px;
border-width: 1px 1px 0px 1px;
margin-right: 7px !important;
}
.custom-btn:last-child {
margin-right: 0 !important;
}

.custom-btn:focus,
.custom-btn.active {
background-color: #222 !important;
color: #fff !important;
border: none !important;
box-shadow: none !important;
}


.flex-container {
margin-top: 10px;
display: flex;
justify-content: space-between;
align-items: center;
}
.addBtn {
padding: 12px 24px 12px 24px;
border-radius: 4px;
width: 112px;
height: 48px;
background: #1b2482;
color: #ffffff;
font-size: 16px;
font-weight: 400;
}

.v-tab {
background-color: transparent !important;
padding: 8px 16px 8px 16px;
}
.v-tabs--density-default {
--v-tabs-height: 40px;
}

.v-tab-item--selected,
.v-tab--selected {
background-color: transparent !important;
}

.content {
padding: 3px 0px 3px 0px;
justify-content: center !important;
}

.v-toolbar {
background-color: transparent !important;
padding: 3px 0;
width: 600px;
display: flex;
align-items: center;
height: 40px !important;
}

.search-theme {
background-color: #dddeea;
width: 600px;
margin-bottom: 26px;
padding-left: 10px;
border-radius: 4px;
padding-bottom: 5px;
}

:deep(.v-input__control) {
/* background-color: #DDDEEA !important; */
min-height: 40px !important;
height: 40px !important;
display: flex;
align-items: center;
}

.v-text-field {
background-color: #dddeea;
width: 600px;
margin-bottom: 26px;
padding-left: 10px;
border-radius: 4px;
}

.v-container {
padding: 16px 16px 0px 0px;
}

/* :deep(.v-field__field){
display: flex;
justify-content: start;
align-items: center;
} */

.outer {
margin: 8px 8px 8px 8px;
height: 100vh;
flex: auto;
}

.custom-table {
/* display: flex;
flex-direction: column; */
}
</style>
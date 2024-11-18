<template>
  <div class="text-start">
    <v-pagination
      v-model="page"
      class="custom-pagination"
      :length="pageLength"
      :total-visible="6"
      @click.prevent="getNewList(page)"
      density="compact"
    ></v-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const page = ref(props.currentPage ?? 1);
const props = defineProps({
  pageLength: Number,
  currentPage: Number
});

const emits = defineEmits(['getList', 'setPage']);
const getNewList = (page) => {
  
  // 以防點到同一頁然後還執行搜尋
  // if(page.value === props.currentPage){
  //   return
  // } 
  emits('setPage', page);
};

watch(
  () => props.currentPage,
  (n) => {
    page.value = n;
  }
);
</script>

<!-- :deep(.v-pagination__item--is-active) {
    background-color: #265667;
    color: #fff;
    border-radius: 8px;
}
:deep(.v-pagination__list){
    margin-bottom: 0px;
} -->
<style scoped lang="scss">
.v-pagination__list {
  justify-content: flex-start !important;
}

.custom-pagination {
  justify-content: start;
  width: 50%;
  margin: 20px 0px 0px 0px;
}
:deep(.v-pagination__list) {
  justify-content: start;
  padding: 0px;
}

:deep(.v-pagination__item--is-active) {
  background-color: #111;
  color: #fff;
  border-radius: 4px;
}
</style>

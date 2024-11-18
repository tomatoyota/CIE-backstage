<template>
  <!---Single Item-->
  <v-list-item
    :to="item.type === 'external' ? '' : { name: item.name, query: { action: 'reset' }}"
    :href="item.type === 'external' ? item.to : ''"
    rounded
    class="mb-1"
    :disabled="item.disabled || route.fullPath.includes(item.to)"
    :target="item.type === 'external' ? '_blank' : ''"
    @click.prevent="setTabs(item)"
  >
    <!---If icon-->
    <template v-slot:prepend>
      <v-icon :icon="item.icon"></v-icon>
      <!-- <component :is="props.item.icon" class="iconClass" :level="props.level"></component> -->
    </template>
    <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
    <!---If Caption-->
    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
      {{ item.subCaption }}
    </v-list-item-subtitle>
    <!---If any chip or label-->
    <template v-slot:append v-if="item.chip">
      <v-chip
        label
        :color="item.chipColor"
        class="sidebarchip hide-menu"
        size="small"
        :variant="item.chipVariant"
        :prepend-icon="item.chipIcon"
      >
        {{ item.chip }}
      </v-chip>
    </template>
  </v-list-item>
</template>

<script setup>
import { useTabsStore } from '@/stores/Tabs.js';
import { useRouter, useRoute } from 'vue-router';
const props = defineProps({ item: Object, level: Number });

const router = useRouter();
const route = useRoute();

const tabsStore = useTabsStore();
const setTabs = (tab) => {
  tabsStore.setTabsList(tab);
  tab.type === 'external' ? '' : router.push({ name: tab.name, query: { action: 'reset' }});
}


</script>
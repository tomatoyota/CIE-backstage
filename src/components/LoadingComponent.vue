<template>
    <!-- loading -->
    <v-overlay
        v-model="overlay"
        persistent
        class="align-center justify-center"
    >
        <v-progress-circular 
            :size="70"
            :width="7"
            indeterminate
            color="#2E2E48">
        </v-progress-circular>
    </v-overlay>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    loading: Boolean
});

const overlay = ref(false);

watch(() => props.loading, (n) => {
    overlay.value = n;
});
</script>
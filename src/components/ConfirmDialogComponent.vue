<template>
    <v-overlay
        v-model="overlay"
        persistent
        class="align-center justify-center"
    >
        <v-card
        width="400"
        >
            <v-card-title>
                <h2>標題</h2>
            </v-card-title>
            <v-card-text>
                內容
            </v-card-text>
            <v-row class="px-4">
                <v-col cols="12">
                    <v-btn 
                    class="w-100" 
                    color="#222222" 
                    flat
                    size="large"
                    @click="confirm()"
                    >確認</v-btn>
                </v-col>
                <v-col cols="12">
                    <v-btn 
                    class="w-100" 
                    @click="closeConfirmDialog()"
                    flat 
                    variant="outlined"
                    size="large"
                    >關閉</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-overlay>
</template>

<script>
export default {
    props: {
        showConfirm: Boolean
    },
    data() {
        return {
            overlay: false
        }
    },
    watch: {
        showConfirm(n) {
            this.overlay = n;
        }
    },
    methods: {
        closeConfirmDialog() {
            this.$emit('close-confirm-dialog');
        },
        confirm(){
            this.$emit('submit')
        }
    }
}

</script>
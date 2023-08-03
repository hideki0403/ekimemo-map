<template>
    <div class="container mx-auto px-8" :class="$style.root">
        <h1 class="text-2xl font-bold">{{ error.statusCode  }}</h1>
        <p class="text-gray-500">{{ error.message }}</p>

        <button class="btn btn-primary" @click="cacheClear">キャッシュをクリア</button>
    </div>
</template>

<script setup>
import * as database from '@/scripts/database'

const props = defineProps({
    error: Object
})

async function cacheClear() {
    await database.cacheClear()
    clearError({ redirect: '/' })
}
</script>

<style module lang="scss">
.root {
    padding-top: 12px;
    padding-bottom: 80px;
}
</style>
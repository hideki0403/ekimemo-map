<template>
    <VitePwaManifest />
    <div class="container mx-auto px-8" :class="$style.root">
        <main>
            <slot />
        </main>
    </div>
    <MeBottomNavigator :navigations="navigations" />
</template>

<script setup>
import boot from '@/scripts/boot'
import MeBottomNavigator from '@/components/MeBottomNavigator.vue'
import { HomeIcon, MapIcon, SettingsIcon } from 'vue-tabler-icons'

boot()

const navigations = [{
    icon: HomeIcon,
    text: '駅サーチ',
    to: '/'
}, {
    icon: MapIcon,
    text: 'マップ',
    to: '/map'
}, {
    icon: SettingsIcon,
    text: '設定',
    to: '/settings'
}]

</script>

<style module lang="scss">
.root {
    padding-top: 12px;
    padding-bottom: 80px;
}
</style>
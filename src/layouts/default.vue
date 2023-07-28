<template>
    <main>
        <slot />
    </main>
</template>

<script setup>
import { HomeIcon, ListIcon, SettingsIcon } from 'vue-tabler-icons'
import { useThemeStore } from '@/store/theme'

const navigations = [{
    icon: HomeIcon,
    text: '駅サーチ',
    to: '/'
}, {
    icon: ListIcon,
    text: 'リスト',
    to: '/list'
}, {
    icon: SettingsIcon,
    text: '設定',
    to: '/settings'
}]

const themeStore = useThemeStore()

</script>
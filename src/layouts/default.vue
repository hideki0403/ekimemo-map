<template>
    <VApp>
        <VContainer>
            <main>
                <slot />
            </main>
        </VContainer>
        <VBottomNavigation>
            <VBtn  v-for="navigation in navigations" :key="navigation.text" :to="navigation.to" exact text>
                <VIcon :icon="navigation.icon" />
                <span class="hidden-sm-and-down">{{ navigation.text }}</span>
            </VBtn>
        </VBottomNavigation>
    </VApp>
</template>

<script setup>
import { HomeIcon, ListIcon, SettingsIcon } from 'vue-tabler-icons'

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
</script>
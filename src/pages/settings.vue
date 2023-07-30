<template>
<div class="_gap">
    <span class="_section_title">通知</span>
    <MeSwitch v-model="enableNotification" @click="toggleNotification">最寄り駅が変わったら通知する</MeSwitch>
    <span class="_section_title">テーマ</span>
    <MeSwitch v-model="useDarkMode">ダークモードにする</MeSwitch>
    <MeSelect :items="Object.keys(themes.lightThemes)" label="ライトテーマ" v-model="lightTheme"></MeSelect>
    <MeSelect :items="Object.keys(themes.darkThemes)" label="ダークテーマ" v-model="darkTheme"></MeSelect>
    <span class="_section_title">駅データ</span>
    <MeButton @click="forceUpdate">最新の駅データにする</MeButton>
</div>
</template>

<script setup lang="ts">
import * as themes from '@/themes'
import MeSelect from '@/components/MeSelect.vue'
import MeSwitch from '@/components/MeSwitch.vue'
import { settingsStore } from '@/scripts/store'
import { execute as forceUpdate } from '@/scripts/updator'

const useDarkMode = computed(settingsStore.toModel('useDarkMode'))
const lightTheme = computed(settingsStore.toModel('lightTheme'))
const darkTheme = computed(settingsStore.toModel('darkTheme'))
const enableNotification = computed(settingsStore.toModel('enableNotification'))

function toggleNotification() {
    if (Notification.permission === 'denied') {
        alert('通知を許可してください')
        settingsStore.set('enableNotification', false)
        return
    }

    if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                settingsStore.set('enableNotification', true)
            }
        })
        return
    }

    settingsStore.set('enableNotification', !enableNotification.value)
}
</script>
<template>
<div class="_gap">
    <span class="_section_title">テーマ</span>
    <MeSwitch v-model="useDarkMode" text="ダークモードにする"></MeSwitch>
    <MeSelect :items="Object.keys(themes.lightThemes)" label="ライトテーマ" v-model="lightTheme"></MeSelect>
    <MeSelect :items="Object.keys(themes.darkThemes)" label="ダークテーマ" v-model="darkTheme"></MeSelect>
</div>
</template>

<script setup lang="ts">
import * as themes from '@/themes'
import MeSelect from '@/components/MeSelect.vue'
import MeSwitch from '@/components/MeSwitch.vue'
import { defaultStore } from '@/scripts/store'

const useDarkMode = computed(defaultStore.toModel('useDarkMode'))
const lightTheme = computed(defaultStore.toModel('lightTheme'))
const darkTheme = computed(defaultStore.toModel('darkTheme'))
</script>
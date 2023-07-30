<template>
    <div :class="$style.root" class="_panel transition-colors">
        <div :class="[$style.index, {[$style.accessed]: !data.isNew, [$style.cooldown]: reminderTime}]">{{ props.data.index }}</div>
        <div :class="$style.main">
            <div>{{ props.data.station.name }}</div>
            <div :class="$style.sub">{{ beautifyScale(props.data.distance) }}</div>
        </div>
        <div>{{ reminderTime }}</div>
    </div>
</template>

<script setup lang="ts">
import { beautifyScale, beautifySeconds } from '@/scripts/utils'
import { settingsStore } from '@/scripts/store'
import type { StationData } from '@/scripts/station'
import { showStationNotification } from '@/scripts/notification'
import dayjs from 'dayjs'

const props = defineProps<{
    data: StationData
}>()

const reminderTime = ref<string | null>(null)
let reminderTimeSeconds = 0
let isReminderActive = false


watch(props, () => {
    activateReminder()
})

function activateReminder() {
    if (props.data.lastAccess && !isReminderActive) updateReminderTime()
}

activateReminder()

function updateReminderTime() {
    const cooldownSeconds = settingsStore.get('cooldownSeconds')
    const enabledReminder = settingsStore.get('enableStationReminder')

    if (!cooldownSeconds) {
        reminderTime.value = null
        return
    }

    isReminderActive = true
    const diffSeconds = dayjs().diff(dayjs(props.data.lastAccess), 'second')

    if (diffSeconds < cooldownSeconds) {
         reminderTime.value = beautifySeconds(cooldownSeconds - diffSeconds)
        setTimeout(updateReminderTime, 1000)   
        return
    }

    if (enabledReminder && props.data.index === 1) {
        reminderTime.value = beautifySeconds(cooldownSeconds - reminderTimeSeconds)
        reminderTimeSeconds++

        if (cooldownSeconds - reminderTimeSeconds < 0) {
            reminderTimeSeconds = 0
            showStationNotification(props.data, true)
        }

        setTimeout(updateReminderTime, 1000)
        return
    }

    reminderTime.value = null
    isReminderActive = false
}

</script>

<style module lang="scss">
.root {
    padding: 8px 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.index {
    color: var(--color-foreground);
    background-color: var(--color-panel-background);
    border-radius: 999px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;

    &.cooldown {
        background-color: var(--color-warning-background) !important;
        color: var(--color-warning) !important;
    }

    &.accessed {
        background-color: var(--color-success-background);
        color: var(--color-success);
    }
}

.main {
    display: flex;
    flex-direction: column;
    // gap: 4px;
    flex: 1;

    .sub {
        font-size: 0.8rem;
        opacity: 0.75;
    }
}
</style>
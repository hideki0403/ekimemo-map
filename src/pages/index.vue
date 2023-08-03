<template>
    <MeButton :color="isGpsActive ? 'primary' : null" @click="toggleGps">
        <CurrentLocationIcon v-if="!isGpsActive" />
        <CurrentLocationOffIcon v-else />
        位置情報{{ isGpsActive ? 'ON' : 'OFF' }}
    </MeButton>

    <MeButton @click="search">検索</MeButton>

    <div>
        <div>{{ currentCoords.latitude }}, {{ currentCoords.longitude }} (精度: {{ beautifyScale(currentCoords.accuracy) }})</div>
        <div>最終更新: {{ currentCoords.updatedAt }}</div>
    </div>

    <div class="_gap">
        <MeStationSimple v-for="data in stations" :key="data.station.id" :data="data" />
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { CurrentLocationIcon, CurrentLocationOffIcon } from 'vue-tabler-icons'
import { beautifyScale } from '@/scripts/utils'
import gps from '@/scripts/gps'
import Station from '@/scripts/station'
import MeButton from '@/components/MeButton.vue'
import MeStationSimple from '@/components/MeStationSimple.vue'

const isGpsActive = gps.isActive
const stations = Station.getReactive

const currentCoords = ref({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    updatedAt: '',
})

function toggleGps() {
    if (isGpsActive.value) {
        gps.stopWatch()
    } else {
        gps.startWatch((x) => {
            currentCoords.value = {
                latitude: x.coords.latitude,
                longitude: x.coords.longitude,
                accuracy: x.coords.accuracy,
                updatedAt: dayjs().format('HH:mm:ss'),
            }

            Station.updateLocation(x.coords.latitude, x.coords.longitude)
        })
    }
}

function search() {
    gps.getCurrentPosition().then(async x => {
        Station.updateLocation(x.coords.latitude, x.coords.longitude)
    })
}

</script>
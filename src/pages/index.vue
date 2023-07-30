<template>
    <MeButton :primary="isGpsActive" @click="toggleGps">
        <CurrentLocationIcon v-if="!isGpsActive" />
        <CurrentLocationOffIcon v-else />
        位置情報{{ isGpsActive ? 'ON' : 'OFF' }}
    </MeButton>

    <MeButton @click="search">検索</MeButton>

    <div class="_gap">
        <MeStationSimple v-for="data in stations" :key="data.station.id" :data="data" />
    </div>
</template>

<script lang="ts" setup>
import { CurrentLocationIcon, CurrentLocationOffIcon } from 'vue-tabler-icons'
import gps from '@/scripts/gps'
import Station from '@/scripts/station'
import MeButton from '@/components/MeButton.vue'
import MeStationSimple from '@/components/MeStationSimple.vue'

const isGpsActive = gps.isActive
const stations = Station.getReactive

function toggleGps() {
    if (isGpsActive.value) {
        gps.stopWatch()
    } else {
        gps.startWatch((x) => {
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
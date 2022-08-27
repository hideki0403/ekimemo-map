import { useRecoilValue, useSetRecoilState } from "recoil"
import { gpsWatchState, gpsCurrentCoordinate, gpsLatestPollingTime } from "@/states/session"
import { gpsPollingRate } from "@/states/config"

type State = {
    watchId: number | null,
    pollingRate: number,
}

type GpsCurrentCoordinate = {
    (param: object): void,
} | null

type GpsLatestPollingTime = {
    (param: string): void,
} | null

let setGpsCurrentCoordinate: GpsCurrentCoordinate, setGpsLatestPollingTime: GpsLatestPollingTime = null
const state: State = {
    watchId: null,
    pollingRate: 10000,
}


// GPSのタイマーに関する処理
function gpsTimer(isEnable: boolean): void {
    // Start
    if(isEnable && !state.watchId) {
        state.watchId = navigator.geolocation.watchPosition((position) => {
            if(!setGpsCurrentCoordinate || !setGpsLatestPollingTime) return

            setGpsCurrentCoordinate({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
            })
            setGpsLatestPollingTime(new Date().toLocaleTimeString())
        }, (error) => {
            console.log(error)
        })
    }

    // Stop
    if(!isEnable && state.watchId) {
        navigator.geolocation.clearWatch(state.watchId)
        state.watchId = null
    }
}

// stateに依存する部分
export default function() {
    setGpsCurrentCoordinate = useSetRecoilState(gpsCurrentCoordinate)
    setGpsLatestPollingTime = useSetRecoilState(gpsLatestPollingTime)

    state.pollingRate = useRecoilValue(gpsPollingRate)
    gpsTimer(useRecoilValue(gpsWatchState))

    return null
}
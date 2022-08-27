import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist({
    key: "recoil-persist",
    storage: typeof window === "undefined" ? undefined : sessionStorage
})

export const gpsWatchState = atom({
    key: "gpsWatch",
    default: false,
    effects_UNSTABLE: [persistAtom]
})

export const gpsCurrentCoordinate = atom({
    key: "gpsCurrentCoordinate",
    default: {
        latitude: 35.685,
        longitude: 139.751,
        accuracy: -1,
    },
    effects_UNSTABLE: [persistAtom]
})

export const gpsLatestPollingTime = atom({
    key: "gpsLatestPollingTime",
    default: null,
    effects_UNSTABLE: [persistAtom]
})
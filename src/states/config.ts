import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist({
    key: "recoil-persist",
    storage: typeof window === "undefined" ? undefined : localStorage
})

export const gpsPollingRate = atom({
    key: "gpsPollingRate",
    default: 10000,
    effects_UNSTABLE: [persistAtom]
})
import * as React from "react"
import { IconButton } from "@chakra-ui/react"
import { MdGpsFixed, MdGpsOff } from "react-icons/md"
import { useRecoilState } from "recoil"
import { gpsWatchState } from "@/states/session"

export default function GpsWatchSwitcher() {
    const [isWatching, setIsWatching] = useRecoilState(gpsWatchState)

    return (
        <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color={isWatching ? "green" : "red"}
            marginLeft="2"
            onClick={() => setIsWatching((state: boolean) => !state)}
            icon={isWatching ? <MdGpsFixed /> : <MdGpsOff />}
            aria-label={isWatching ? "停止" : "開始"}
        />
    )
}

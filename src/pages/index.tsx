import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Text, Stack, Flex } from '@chakra-ui/react'
import ContentBox from '@/components/ContentBox'
import StationChild from '@/components/StationChild'
import useInterval from '@/components/useInterval'
import { gpsWatchState, gpsLatestPollingTime, gpsCurrentCoordinate } from '@/states/session'

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const isWatchingGps = useRecoilValue(gpsWatchState)
  const latestPollingTime = useRecoilValue(gpsLatestPollingTime)
  const currentCoordinate = useRecoilValue(gpsCurrentCoordinate)

  useInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString())
  }, 1000)

  return (
    <Flex gap={6} flexWrap='wrap'>
      <ContentBox title='最寄り駅リスト'>
        <Stack>
          <StationChild place={1} stationName={"テスト駅"} lineName={"テスト線"} waitTime={150} recordColor='red' distance={712} />
          <StationChild place={2} stationName={"テスト2駅"} lineName={"テスト2線"} waitTime={0} recordColor='blue' distance={1150} />
        </Stack>
      </ContentBox>
      <ContentBox title='情報'>
        <Text suppressHydrationWarning>現在時刻: {currentTime}</Text>
        <Text>観測時刻: {isWatchingGps ? latestPollingTime : '--:--:--'}</Text>
        <Text>座標: {isWatchingGps ? `${currentCoordinate.latitude}, ${currentCoordinate.longitude}` : ''}</Text>
        <Text>誤差: {isWatchingGps ? `${Math.round(currentCoordinate.accuracy)}m` : ''}</Text>
      </ContentBox>
    </Flex>
  )
}
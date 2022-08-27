import {
    Box,
    Text,
    HStack,
    Spacer,
    Badge
} from "@chakra-ui/react"

function timeBeautify(seconds: number): string {
    return seconds ? `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}` : 'アクセス可能'
}

function distanceBeautify(meters: number): string {
    return meters >= 1000 ? `${Math.round(meters / 100) / 10}km` : `${meters}m`
}

export default function StationChild(props: { place: number, stationName: string, lineName: string, waitTime: number, recordColor: string, distance: number }) {
  return (
    <HStack isInline width="100%" padding='3px 0'>
        <Badge marginRight={4} colorScheme={props.recordColor}>{props.place}</Badge>
        <Box>
            <Text fontSize="xl" fontWeight="bold">{props.stationName}</Text>
            <Text fontSize='sm'>{props.lineName}</Text>
        </Box>
        <Spacer />
        <Text p='0 6px'>{timeBeautify(props.waitTime)}</Text>
        <Text color='gray.500'>{distanceBeautify(props.distance)}</Text>
    </HStack>
  )
}
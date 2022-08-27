import { Box, Heading } from "@chakra-ui/react"

export default function ContentBox(props: { title?: string, children: React.ReactNode }) {
  return (
      <Box p={4} borderRadius='lg' borderWidth='1px' flexGrow='1'>
          {props.title && <Heading fontSize='lg' margin='6px 0' color='gray.500'>{props.title}</Heading>}
          {props.children}
      </Box>
  )
}
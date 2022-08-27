import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, useRoutes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { Box, ChakraProvider, Heading, HStack, Spacer, Text } from '@chakra-ui/react'
import { ColorModeSwitcher } from '@/components/ColorModeSwitcher'
import GpsWatchSwitcher from '@/components/GpsWatchSwitcher'
import routes from '~react-pages'
import Logic from '@/app'

const App = () => {
  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </React.Suspense>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <Logic />
      <ChakraProvider resetCSS>
        <Box p={6}>
          <HStack>
            <Heading>駅メッシュマップ</Heading>
            <Text>Ver.0.1.0</Text>
            <Spacer />
            <GpsWatchSwitcher />
            <ColorModeSwitcher />
          </HStack>
          <Box w="100%" p={3} />
          <Router>
            <App />
          </Router>
        </Box>
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
)

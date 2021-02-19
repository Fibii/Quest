import React, { lazy, Suspense } from 'react'
import BrowserRouter from 'react-router-dom/BrowserRouter'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import Grid from '@material-ui/core/Grid'

const MainApp = lazy(() => import('./components/MainApp/MainApp'))

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingScreen/>}>
        <MainApp />
    </Suspense>
  </BrowserRouter>
)

export default App

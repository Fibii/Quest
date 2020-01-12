import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MainApp from './components/mainApp'


const App = () => {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  )
}

export default App

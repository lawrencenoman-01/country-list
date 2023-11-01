import './style/App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Homepage } from './pages'
import Detail from './pages/Detail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/detail/:countryName' element={<Detail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

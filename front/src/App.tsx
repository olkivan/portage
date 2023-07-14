import './App.scss'

import Main from './screens/Main'
import Alice from './screens/Alice'
import Bob from './screens/Bob'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/upload" element={<Alice />} />
        <Route path="/download" element={<Bob />} />
      </Routes>
    </div>
  )
}

export default App

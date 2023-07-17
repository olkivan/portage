import './App.scss'

import Main from './screens/Main'
import Alice from './screens/Alice'
import Bob from './screens/Bob'

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/portage/" element={<Main />} />
        <Route path="/portage/upload" element={<Alice />} />
        <Route path="/portage/download" element={<Bob />} />
      </Routes>
    </div>
  )
}

export default App

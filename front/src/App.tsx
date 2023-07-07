import './App.scss'

import Main from './screens/Main'
import Alice from './screens/Alice'
import Bob from './screens/Bob'

import { selectScreen } from './redux/globalsSlice'
import { useAppSelector } from './redux/hooks'

function App() {
  const screen = useAppSelector(selectScreen)

  return (
    <div className="App">
      {screen === 'main' && <Main />}
      {screen === 'alice' && <Alice />}
      {screen === 'bob' && <Bob />}
    </div>
  )
}

export default App

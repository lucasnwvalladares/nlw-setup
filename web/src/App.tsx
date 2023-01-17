import './styles/global.css'
import { Habit } from './components/Habit'

function App() {
  return (
    <div>
      <Habit completed={3} />
      <Habit completed={23} />
      <Habit completed={5} />
      <Habit completed={15} />
      <Habit completed={63} />
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className=''>Tailwind test</h1>
     <Card username="Jenil" />
     <Card username="ayush"/>
     <Card/>

    </>
  )
}

export default App

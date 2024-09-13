import {useState} from "react"

function App() {
 const [color,setColor] = useState("olive")

  return (
    <div className="w-full h-screen duration-200"
    style={{backgroundColor:color}}
    >
      <div className="fixed flex flex-wrap
      justify-center bottom-12 inset-x-0 px-2">
      <div className="fixed flex flex-wrap justify-center
      gap-3 shadow-lg bg-white px-3 py-2 rounded-2xl">
      <button
       onClick={()=>setColor("red")}
       className="outline-none px-4 py-4 rounded-xl text-white shadow-sm" 
       style={{backgroundColor:"red"}}
      >RED</button>  

      <button
       onClick={()=>setColor("Green")}
       className="outline-none px-4 py-4 rounded-xl text-white shadow-sm" 
       style={{backgroundColor:"Green"}}
      >Green</button>

        <button
         onClick={()=>setColor("Blue")}
      className="outline-none px-4 py-4 rounded-xl text-white shadow-sm" 
      style={{backgroundColor:"Blue"}}
      >Blue</button>
      
        <button
         onClick={()=>setColor("orange")}
     className="outline-none px-4 py-4 rounded-xl text-white shadow-sm" 
     style={{backgroundColor:"orange"}}
    >orange</button>  
      </div>

      </div>
       
    </div>
  )
}

export default App

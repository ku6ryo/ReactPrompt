import { usePrompt } from "./Prompt"
import { useState } from "react"

function App() {
  const { open, elem } = usePrompt()
  const [value, setValue] = useState<string>("")
  const onOpenClick = () => {
    open("Initial value").then((value) => {
      setValue(value || "cancelled")
    })
  }
  return (
    <>
      <div>
        <button onClick={onOpenClick}>Open prompt</button>
      </div>
      {value && <div>Input value: {value}</div>}
      {elem}
    </>
  )
}

export default App

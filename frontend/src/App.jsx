import { Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { RegisterPatient } from "./pages/RegisterPatient"
import { RegisterMedic } from "./pages/RegisterMedic"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/RegisterPatient" element={<RegisterPatient/>}/>
      <Route path="/RegisterMedic" element={<RegisterMedic/>}/>
    </Routes>
  )
}

export default App
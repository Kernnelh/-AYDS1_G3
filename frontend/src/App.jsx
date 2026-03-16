import { Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { RegisterPatient } from "./pages/RegisterPatient"
import { RegisterMedic } from "./pages/RegisterMedic"
import { DashboardPatient } from "./pages/DashboardPatient"
// import { DashboardMedic } from "./pages/DashboardMedic"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/RegisterPatient" element={<RegisterPatient/>}/>
      <Route path="/RegisterMedic" element={<RegisterMedic/>}/>
      <Route path="/DashboardPatient" element={<DashboardPatient/>}/>
      {/* <Route path="/DashboardMedic" element={<DashboardMedic/>}/> */}
    </Routes>
  )
}

export default App
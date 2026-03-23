import { Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { RegisterPatient } from "./pages/RegisterPatient"
import { RegisterMedic } from "./pages/RegisterMedic"
import { DashboardPatient } from "./pages/DashboardPatient"
import { DashboardMedic } from "./pages/DashboardMedic"
import { DashboardAdmin } from "./pages/DashboardAdmin"
import { AdminAuth } from "./pages/AdminAuth"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/RegisterPatient" element={<RegisterPatient/>}/>
      <Route path="/RegisterMedic" element={<RegisterMedic/>}/>
      <Route path="/DashboardPatient" element={<DashboardPatient/>}/>
      <Route path="/DashboardMedic" element={<DashboardMedic/>}/>
      <Route path="/DashboardAdmin" element={<DashboardAdmin/>}/>
      <Route path="/AdminAuth" element={<AdminAuth/>} />
    </Routes>
  )
}

export default App
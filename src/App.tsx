import { Route, Routes } from "react-router-dom"
import Home from "./pages/client/Home"
import AdminLayout from "./components/admin/AdminLayout"
import AddLaptop from "./pages/admin/AddLaptop"
import Index from "./pages/admin/Index"
import AdminLogin from "./pages/admin/AdminLogin"

function App() {
  return (
    <Routes>
      {/* Client */}
      <Route>
        <Route index element={<Home />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Index />} />
        <Route path="/admin/add-laptop" element={<AddLaptop />} />
      </Route>

      {/* Auth */}
      <Route path="/auth/admin" element={<AdminLogin />} />
    </Routes>
  )
}

export default App

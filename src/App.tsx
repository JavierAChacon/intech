import { Route, Routes } from "react-router-dom"
import Home from "./pages/client/Home"
import AdminLayout from "./components/admin/AdminLayout"
import AddLaptop from "./pages/admin/AddLaptop"
import Index from "./pages/admin/Index"
import AdminLogin from "./pages/admin/AdminLogin"
import ClientLayout from "./components/client/ClientLayout"
import Laptop from "./pages/client/Laptop"
import Cart from "./pages/client/Cart"
import Search from "./pages/client/Search"

function App() {
  return (
    <Routes>
      {/* Client */}
      <Route element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="/laptop/:id" element={<Laptop />} />
        <Route path="/laptop/:id/:configuration" element={<Laptop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:option" element={<Search />} />
        <Route path="/search/:option/:id/:configuration" element={<Laptop />} />
        <Route path="/search/:id/:configuration" element={<Laptop />} />
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

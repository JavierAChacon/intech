import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import { useEffect } from "react"
import checkUserRole from "../../utils/checkUserRole"

const AdminLayout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    checkUserRole(navigate)
  }, [navigate])

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

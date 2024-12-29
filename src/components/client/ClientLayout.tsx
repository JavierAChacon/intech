import { Outlet } from "react-router-dom"
import NavigationBar from "./NavigationBar"
import ClientFooter from "./ClientFooter"
const ClientLayout = () => {
  return (
    <div>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  )
}

export default ClientLayout

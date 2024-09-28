import { Outlet } from "react-router-dom"
import NavigationBar from "./NavigationBar"
import ClientFooter from "./ClientFooter"
const ClientLayout = () => {
  return (
    <>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
      <ClientFooter />
    </>
  )
}

export default ClientLayout

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/admin/login")
  }

  return (
    <nav className="h-dvh w-40 border-r">
      <ul className="items-left flex h-full flex-col justify-center gap-y-3 p-3">
        <li>
          <Link to="/admin/add-laptop">Add Laptop</Link>
        </li>

        <li>
          <button onClick={handleClick}>Log out</button>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar

import { supabase } from "../supabase"
import { NavigateFunction } from "react-router-dom"

const checkUserRole = async (navigate: NavigateFunction): Promise<void> => {
  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      navigate("/auth/admin")
      return
    }

    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (roleError) {
      navigate("/auth/admin")
      return
    }

    const { role } = roleData

    if (role !== "Admin") {
      navigate("/auth/admin")
    }
  } catch (error) {
    console.error("Error verificando el rol del usuario:", error)
    navigate("/auth/admin")
  }
}

export default checkUserRole

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import z from "zod"
import { supabase } from "../../supabase"
import Loader from "../../components/admin/Loader"

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
})

type LoginSchemaType = z.infer<typeof LoginSchema>

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema)
  })

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    const { email, password } = data

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        })

      if (authError) {
        setError("root.serverError", {
          type: authError.code,
          message: authError.message
        })
        return
      }

      const userId = authData.user.id

      const { data: dataRole, error: roleError } = await supabase
        .from("role")
        .select("role")
        .eq("id", userId)
        .single()

      if (roleError) {
        setError("root.serverError", {
          type: roleError.code,
          message: roleError.message
        })
        return
      }

      const { role } = dataRole

      if (role === "Admin") {
        navigate("/admin")
      } else {
        setError("root.serverError", {
          type: "403",
          message: "You do not have administrator permissions"
        })
      }
    } catch {
      setError("root.serverError", {
        type: "500",
        message: "An unexpected error has occurred"
      })
    }
  }

  return (
    <div className="flex h-dvh items-center justify-center bg-gray-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-60 flex-col items-center gap-y-3 rounded-3xl bg-white p-3 shadow-2xl"
      >
        {/* Mostrar error general */}
        {errors.root?.serverError && (
          <p className="mb-3 text-center text-sm text-red-500">
            {errors.root.serverError.message}
          </p>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="rounded-2xl border px-2 py-1"
          />
          {errors.email && (
            <p className="text-red- text-center text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="rounded-2xl border px-2 py-1"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-blue-400 px-2 py-1 text-white disabled:bg-blue-200"
        >
          {isSubmitting ? <Loader /> : "Log in"}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin

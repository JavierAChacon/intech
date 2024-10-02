import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spin as Hamburger } from "hamburger-react"
import cart from "../../assets/icons/cart.svg"
import logo from "../../assets/icons/logo.svg"
import user from "../../assets/icons/user.svg"
import { useState } from "react"

const SearchSchema = z.object({
  search: z.string()
})

type SearchSchemaType = z.infer<typeof SearchSchema>

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit } = useForm<SearchSchemaType>({
    resolver: zodResolver(SearchSchema)
  })

  const onSubmit: SubmitHandler<SearchSchemaType> = (data) => {
    console.log(data)
  }

  return (
    <header>
      <nav>
        <div className="flex items-center border border-b-blue-main py-3 md:border-0">
          <div className="ml-2 flex items-center">
            <Link to="/">
              <img src={logo} alt="intech" className="md:h-5" />
            </Link>
          </div>

          <div className="flex flex-1 justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Search"
                className="w-48 rounded-md bg-gray-300 px-2 placeholder:text-gray-800 md:h-9 md:w-96"
                {...register("search")}
              />
            </form>
          </div>

          <div className="mr-2 flex items-center space-x-2">
            <Link
              to="/account"
              className="flex items-center space-x-1 text-blue-main"
            >
              <img src={user} alt="user" className="max-md:hidden md:h-8" />
              <span className="max-md:hidden">account</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-1 text-blue-main"
            >
              <img src={cart} alt="cart" className="md:h-8" />
              <span className="max-md:hidden">cart</span>
            </Link>

            <div className="md:hidden">
              <Hamburger
                toggled={isOpen}
                toggle={setIsOpen}
                color="#223fc7"
                size={27}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto flex justify-between border-t border-blue-main px-[15%] pt-2 text-blue-main max-md:hidden">
          <Link to="/">Shop by category</Link>

          <Link to="/">Brands</Link>

          <Link to="/">Accesories</Link>

          <Link to="/">Sale & Offers</Link>

          <Link to="/">Costumer Service</Link>
        </div>
      </nav>
    </header>
  )
}

export default NavigationBar

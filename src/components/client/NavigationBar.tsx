import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spin as Hamburger } from "hamburger-react"
import cart from "../../assets/icons/cart.svg"
import logo from "../../assets/icons/logo.svg"
import { useEffect, useState } from "react"
import { supabase } from "@/supabase"
import { useIsMobile } from "@/hooks/useIsMobile"
import { FaSearch } from "react-icons/fa"

const SearchSchema = z.object({
  search: z.string()
})

interface Configuration {
  configuration_id: string
  id: string
  brand: string
  model: string
  category: string
  graphic_card: string
  processor: string
  ram: number
  screen: number
  storage: string
  price: number
}

const links = [
  {
    to: "/",
    text: "Home"
  },
  {
    to: "/search",
    text: "All laptops"
  },
  {
    to: "/search/categories",
    text: "Shop by category"
  },
  {
    to: "/search/brands",
    text: "Brands"
  }
]

type SearchSchemaType = z.infer<typeof SearchSchema>

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { register, watch, reset } = useForm<SearchSchemaType>({
    resolver: zodResolver(SearchSchema)
  })

  const [results, setResults] = useState<Configuration[]>([])
  const [laptops, setLaptops] = useState<Configuration[]>([])
  const searchValue = watch("search")
  const isMobile = useIsMobile()

  useEffect(() => {
    const fecthLaptops = async () => {
      const { data: laptopsFetched, error: laptopsError } = await supabase
        .from("laptop_configurations_table")
        .select("*")

      if (laptopsError) {
        console.error(laptopsError)
      }

      setLaptops(laptopsFetched ? laptopsFetched : [])
    }

    fecthLaptops()
  }, [])

  useEffect(() => {
    if (searchValue) {
      const filtered = laptops
        .filter((laptop) =>
          `${laptop.brand} ${laptop.model} - ${laptop.screen}" - ${laptop.processor} with ${laptop.ram} Memory - ${laptop.storage}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        )
        .slice(0, 5)
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchValue, laptops])

  return (
    <header>
      <nav>
        <div className="mx-auto flex items-center border border-b-blue-main py-3 md:border-0 lg:w-3/4">
          <div className="ml-2 flex items-center">
            <Link to="/">
              <img src={logo} alt="intech" className="md:h-5" />
            </Link>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center">
            <form>
              <input
                type="text"
                placeholder="Search"
                className="w-48 rounded-md bg-gray-300 px-2 placeholder:text-gray-800 md:h-9 md:w-96"
                {...register("search")}
              />
            </form>
            {results.length > 0 && (
              <div className="absolute top-7 z-10 flex w-48 flex-col rounded-2xl border-black bg-gray-300 md:top-10 md:w-96 md:border-2">
                {results.map((result, index) => {
                  const { configuration_id, id } = result
                  const laptopName = `${result.brand} ${result.model} - ${result.screen}" - ${result.processor} with ${result.ram} Memory - ${result.storage}`
                  return (
                    <Link
                      to={`/laptop/${id}/${configuration_id}`}
                      key={configuration_id}
                      onClick={() => reset({ search: "" })}
                      className={`flex items-center gap-x-2 border-b p-2 md:gap-x-3 ${index === results.length - 1 && "rounded-b-2xl border-b-0"} ${index === 0 && "rounded-t-2xl"} hover:bg-gray-200`}
                    >
                      <FaSearch />
                      <p className="text-xs md:text-sm">
                        {isMobile && laptopName.length > 50
                          ? `${laptopName.slice(0, 50)}...`
                          : laptopName}
                      </p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="mr-2 flex items-center space-x-2">
            <Link
              to="/cart"
              className="flex items-center space-x-1 text-blue-main"
            >
              <img src={cart} alt="cart" className="md:h-8" />
              <span className="max-md:hidden">cart</span>
            </Link>

            <div
              className={`${isOpen ? "fixed right-2 top-2 z-20 lg:hidden" : ""}`}
            >
              <Hamburger
                toggled={isOpen}
                toggle={setIsOpen}
                color={isOpen ? "white" : "#223fc7"}
                size={27}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-blue-main px-[15%] pt-2 text-blue-main max-lg:hidden">
          <div className="mx-auto flex w-1/2 justify-between">
            {links.map((link) => (
              <Link to={link.to} key={link.to}>
                {link.text}
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`${isOpen ? "right-0" : "-right-full"} transition-right fixed top-0 z-10 flex h-dvh w-full flex-col items-center justify-center bg-blue-main text-white duration-300`}
        >
          <ul className="space-y-5">
            {links.map((link) => (
              <li onClick={() => setIsOpen(false)} key={link.to}>
                <Link
                  to={link.to}
                  key={link.to}
                  className="text-2xl font-semibold"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default NavigationBar

import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import { Link } from "react-router-dom"
import { useIsMobile } from "../../hooks/useIsMobile"
import PickUp from "../../components/icons/PickUp"
import SameDay from "../../components/icons/SameDay"
import NextDay from "../../components/icons/NextDay"
import Standard from "../../components/icons/Standard"
import macbook from "../../assets/images/Macbook-Pro-Mockup.png"
import laptop_1 from "../../assets/images/laptop_1.png"
import robot from "../../assets/icons/robot.svg"
import laptop_2 from "../../assets/images/laptop_2.png"
import plastic_card from "../../assets/images/plastic_card.png"

export interface Laptop {
  id: string
  model: string
  brand: string
  price: number
  image: string
}

const Home = () => {
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const isMobile = useIsMobile()

  const deliveries = [
    {
      description: "Pick-up in store",
      Icon: PickUp
    },
    {
      description: "Same-day delivery",
      Icon: SameDay
    },
    {
      description: "Next day delivery",
      Icon: NextDay
    },
    {
      description: "Standard delivery",
      Icon: Standard
    }
  ]

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const { data: laptopData, error } = await supabase
          .from("laptop")
          .select("id, brand, model, price")
          .limit(5)

        if (error) {
          console.error(error)
          return
        }

        const laptopsWithImages = await Promise.all(
          laptopData.map(async (laptop) => {
            const { data: files, error: filesError } = await supabase.storage
              .from("laptops")
              .list(`${laptop.id}/`, { limit: 1 })

            if (filesError) {
              console.error(filesError)
              return { ...laptop, image: "" }
            }

            const {
              data: { publicUrl }
            } = supabase.storage
              .from("laptops")
              .getPublicUrl(`${laptop.id}/${files[0].name}`)

            return { ...laptop, image: publicUrl }
          })
        )

        setLaptops(laptopsWithImages)
      } catch (error) {
        console.error(error)
      }
    }

    fetchLaptops()
  }, [])

  return (
    <div className="overflow-x-hidden font-baloo">
      <section className="flex flex-col overflow-x-hidden bg-[linear-gradient(180deg,_white_0%,_#223fc7_100%)] lg:items-center">
        <div className="grid grid-cols-1 md:grid-flow-col md:grid-cols-2 md:items-center md:gap-8">
          <div className="order-2 md:order-1 md:justify-self-end">
            <img src={macbook} alt="Macbook" className="w-full md:w-[35rem]" />
            <p className="text-center text-xl tracking-widest text-white md:hidden">
              Explore without limits
            </p>
          </div>

          <div className="order-1 text-center md:order-2 md:text-left">
            <h1 className="mt-3 text-3xl font-bold leading-none text-[#16243F] md:text-4xl lg:text-[4rem] lg:leading-[0.8]">
              Discover the future
              <br />
              of technology today
            </h1>
            <p className="max-md:hidden md:mt-2 md:text-2xl md:tracking-widest md:text-white lg:text-4xl">
              Explore without limits
            </p>
          </div>
        </div>

        <div className="md:h-76 md:relative md:bottom-7 md:flex md:items-center md:gap-x-4">
          <div className="mx-auto my-3 w-[22rem] max-w-[90%] rounded-2xl bg-white px-4 py-2 text-blue-main md:w-[20rem]">
            <h2 className="text-3xl font-extrabold md:mb-2">Top picks</h2>
            <p className="text-sm md:w-[15rem] md:text-lg md:leading-none">
              Discover our most popular tech essentials
            </p>
          </div>

          <div className="mb-4 px-[5%] md:mb-0">
            {laptops.length > 0 ? (
              laptops.map((laptop) => (
                <Link
                  to={`/laptop/${laptop.id}`}
                  className="flex h-36 w-36 flex-col items-center justify-center rounded-2xl bg-white text-center"
                  key={laptop.id}
                >
                  <div>
                    <img
                      src={laptop.image}
                      alt={laptop.model}
                      className="h-20"
                    />
                  </div>
                  <p>
                    {laptop.brand} {laptop.model}
                  </p>
                  <span className="text-xl font-bold">${laptop.price}</span>
                </Link>
              ))
            ) : (
              <div className="no-scrollbar my-4 flex gap-x-4 overflow-x-scroll p-[5%] md:my-0 md:w-[calc(100vw-25rem)] lg:p-0">
                <div className="h-36 min-h-36 w-36 min-w-36 flex-grow animate-pulse rounded-2xl bg-gray-300 md:h-36 md:w-36" />
                <div className="min-h-36 w-36 min-w-36 flex-grow animate-pulse rounded-2xl bg-gray-300 md:h-36 md:w-36" />
                <div className="min-h-36 w-36 min-w-36 flex-grow animate-pulse rounded-2xl bg-gray-300 md:h-36 md:w-36" />
                <div className="min-h-36 w-36 min-w-36 flex-grow animate-pulse rounded-2xl bg-gray-300 md:h-36 md:w-36" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-96 max-w-[95%] md:grid md:w-[95%] md:grid-cols-12 md:grid-rows-4">
        <div className="mx-auto mt-4 w-[22rem] rounded-2xl bg-gray-300 p-2 text-center md:col-span-6 md:row-span-3 md:flex md:w-[70%] md:flex-col md:items-center md:justify-center">
          <h3 className="text-2xl font-bold md:text-4xl lg:mt-3">
            Need Some Guidance?
          </h3>

          <p className="max-w-full md:my-3 md:text-2xl lg:w-[28rem]">
            Shopping by your goals ensures you get the most suitable products
            tailored to your specific needs.
          </p>

          <Link
            to="/"
            className="mx-auto my-4 block w-fit rounded-2xl bg-orange-main px-5 py-2 text-white lg:text-xl"
          >
            Shop by category
          </Link>

          <div className="relative top-4 scale-110 md:mt-5">
            <img src={laptop_1} alt="laptop_1" className="md:mx-auto" />
          </div>
        </div>

        <div className="mb-5 mt-8 flex gap-x-2 text-center md:col-span-5 md:row-span-1 md:items-center">
          <div>
            <img src={robot} alt="robot" className="w-32" />
          </div>

          <div className="flex-1">
            <Link
              to="/"
              className="mx-auto my-4 rounded-2xl bg-orange-main px-1 py-2 text-white md:min-w-max md:bg-white md:font-bold md:text-black lg:text-3xl"
            >
              Shop with an expert
            </Link>

            <p className="mt-3 text-left lg:text-xl">
              Get personalized advice from our tech experts to make your
              purchase smarter and more effective.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-gray-300 p-2 md:col-span-5 md:row-span-3 md:flex md:flex-col md:items-center md:justify-center">
          <h3 className="text-center text-3xl text-gray-500 md:w-[21rem] md:text-4xl md:tracking-wider md:text-black">
            Explore Our Clearance Deals and Unbeatable Offers!
          </h3>

          <div className="mt-3">
            <img src={laptop_2} alt="laptop" className="scale-[115%]" />
          </div>

          <button className="mx-auto my-4 mb-2 mt-6 block w-fit rounded-2xl bg-orange-main px-5 py-2 text-lg text-white lg:text-xl">
            <Link to="/">Save big today!</Link>
          </button>
        </div>

        <div className="md:col-span-6 md:row-span-1 md:my-auto">
          <h4 className="mb-1 mt-5 text-center text-xl font-extrabold md:my-4 md:text-2xl">
            Fast, Reliable Delivery
          </h4>

          <div className="rounded-xl bg-blue-main p-4 text-white md:mx-auto md:w-[55%] md:bg-white md:p-0 md:text-black">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-4 md:grid-rows-1">
              {deliveries.map((delivery) => {
                const { Icon, description } = delivery
                return (
                  <div className="flex flex-col items-center justify-center gap-y-1">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2 md:h-10 md:w-10 md:bg-blue-main lg:h-20 lg:w-20">
                      <Icon color={isMobile ? "223fc7" : "fff"} />
                    </div>
                    <p
                      className="w-20 text-center md:text-sm lg:text-base"
                      style={{ lineHeight: 1 }}
                    >
                      {description}
                    </p>
                  </div>
                )
              })}
            </div>
            <p className="mx-auto mt-5 block max-w-[70%] text-center font-extrabold md:mt-4 md:max-w-full lg:text-xl">
              Choose the Shipping Option That Fits Your Needs
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto my-3 w-96 max-w-[95%] text-center md:w-auto">
        <div className="md:flex md:items-center md:justify-center">
          <div>
            <img src={plastic_card} alt="gift card" />
          </div>
          <div className="md:min-w-max">
            <h3 className="mt-3 text-2xl font-bold lg:text-4xl">
              Give the gift of technology
            </h3>
            <p className="mb-4 text-lg lg:text-3xl">
              Purchase Your InTech Gift Card Today!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

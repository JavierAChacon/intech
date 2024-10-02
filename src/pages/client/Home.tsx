import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import { Link } from "react-router-dom"
import macbook from "../../assets/images/Macbook-Pro-Mockup.png"
import laptop_1 from "../../assets/images/laptop_1.png"
import robot from "../../assets/images/robot.png"
import laptop_2 from "../../assets/images/laptop_2.png"
import plastic_card from "../../assets/images/plastic_card.png"
import { useIsMobile } from "../../hooks/useIsMobile"

export interface Laptop {
  id: string
  model: string
  brand: string
  price: number
  image: string
}

const Home = () => {
  const [laptops, setLaptops] = useState<Laptop[]>([])
  const [icons, setIcons] = useState<{ [key: string]: string }>({})
  const isMobile = useIsMobile()

  const deliveries = {
    pickUp: "Pick-up in store",
    sameDay: "Same-day delivery",
    nextDay: "Next day delivery",
    standard: "Standard delivery"
  }

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

    const loadIcons = async () => {
      const loadedImages: { [key: string]: string } = {}
      for (const key of Object.keys(deliveries)) {
        try {
          const image = await import(`../../assets/icons/${key}.svg`)
          loadedImages[key] = image.default
        } catch (error) {
          console.error(`Error loading image for ${key}`, error)
        }
      }
      setIcons(loadedImages)
    }

    fetchLaptops()
    loadIcons()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className="flex flex-col items-center bg-[linear-gradient(180deg,_white_0%,_#223fc7_100%)]">
        {isMobile ? (
          <div className="text-center">
            <h1 className="mt-3 text-3xl font-bold leading-none text-[#16243F]">
              Discover the future
              <br />
              of technology today
            </h1>

            <div>
              <img src={macbook} alt="Macbook" />
            </div>

            <p className="text-lg text-white">Explore without limits</p>
          </div>
        ) : (
          <div className="flex flex-row-reverse items-center">
            <div>
              <h1 className="mt-3 text-4xl font-bold leading-none text-[#16243F]">
                Discover the future
                <br />
                of technology today
              </h1>
              <p className="mt-2 text-2xl tracking-widest text-white">
                Explore without limits
              </p>
            </div>

            <div>
              <img src={macbook} alt="Macbook" className="w-[35rem]" />
            </div>
          </div>
        )}

        <div className="my-3 w-[22rem] max-w-[90%] rounded-2xl bg-white px-4 py-2 text-blue-main">
          <h2 className="text-2xl font-extrabold">Top picks</h2>
          <p>Discover our most popular tech essentials</p>
        </div>

        <div className="no-scrollbar overflow-x-scroll">
          {laptops.length > 0 ? (
            laptops.map((laptop) => (
              <Link
                to={`/laptop/${laptop.id}`}
                className="mb-3 flex h-36 w-36 flex-col items-center justify-center rounded-2xl bg-white text-center"
                key={laptop.id}
              >
                <div>
                  <img src={laptop.image} alt={laptop.model} className="h-20" />
                </div>

                <p>
                  {laptop.brand} {laptop.model}{" "}
                </p>

                <span className="text-xl font-bold">${laptop.price}</span>
              </Link>
            ))
          ) : (
            <p>No laptop available</p>
          )}
        </div>
      </section>

      <section className="mx-auto w-96 max-w-[95%]">
        <div className="mx-auto mt-4 w-[22rem] rounded-2xl bg-gray-300 p-2 text-center">
          <h3 className="text-2xl font-bold">Need Some Guidance?</h3>

          <p>
            Shopping by your goals ensures
            <br />
            you get the most suitable products
            <br />
            tailored to your specific needs.
          </p>

          <Link
            to="/"
            className="mx-auto my-4 block w-1/2 rounded-2xl bg-orange-main px-1 py-2 text-white"
          >
            Shop by category
          </Link>

          <div className="relative top-4 scale-110">
            <img src={laptop_1} alt="laptop_1" />
          </div>
        </div>

        <div className="mb-5 mt-8 flex gap-x-2 text-center">
          <div>
            <img src={robot} alt="robot" className="w-32" />
          </div>

          <div className="flex-1">
            <Link
              to="/"
              className="mx-auto my-4 rounded-2xl bg-orange-main px-1 py-2 text-white"
            >
              Shop with an expert
            </Link>

            <p className="mt-3 text-left">
              Get personalized advice from our tech experts to make your
              purchase smarter and more effective.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-96 max-w-[95%] text-center">
        <div className="rounded-2xl bg-gray-300 p-2">
          <h3 className="text-3xl text-gray-500">
            Explore Our Clearance
            <br />
            Deals and Unbeatable
            <br />
            Offers!
          </h3>

          <div className="mt-3">
            <img src={laptop_2} alt="laptop" className="scale-[115%]" />
          </div>

          <button className="mb-2 mt-6 rounded-lg bg-orange-main px-3 py-1 text-lg text-white">
            <Link to="/">Save big today!</Link>
          </button>
        </div>
      </section>

      <section className="mx-auto w-96 max-w-[95%] text-center">
        <h4 className="my-5 text-xl font-extrabold">Fast, Reliable Delivery</h4>

        <div className="rounded-xl bg-blue-main p-4 text-white">
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {Object.entries(deliveries).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center gap-y-1"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2">
                    {icons[key] && <img src={icons[key]} alt={value} />}
                  </div>
                  <p className="w-20 text-center leading-none">{value}</p>
                </div>
              )
            })}
          </div>
          <p className="mx-auto mt-5 block max-w-[70%] font-extrabold">
            Choose the Shipping Option That Fits Your Needs
          </p>
        </div>

        <div>
          <div>
            <img src={plastic_card} alt="gift card" />
          </div>
          <h3 className="text-2xl font-bold">Give the gift of technology</h3>
          <p className="text-lg">Purchase Your InTech Gift Card Today!</p>
        </div>
      </section>
    </>
  )
}

export default Home

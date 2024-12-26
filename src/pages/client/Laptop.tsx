import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import fetchLaptop, { LaptopInformation } from "../../utils/fetchLaptop"
import { useIsMobile } from "../../hooks/useIsMobile"
import useCartStore from "../../store"
import LaptopSkeleton from "../../components/client/LaptopSkeleton"
import { toast } from "@/hooks/use-toast"
import { supabase } from "../../supabase"

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

const Laptop = () => {
  const [laptop, setLaptop] = useState<LaptopInformation | null>(null)
  const [laptopConfiguration, setLaptopConfiguration] =
    useState<Configuration>()
  const [laptopName, setLaptopName] = useState<string>("")
  const [laptopPrice, setLaptopPrice] = useState<number>(0)
  const [deliveryIcons, setDeliveryIcons] = useState<{ [key: string]: string }>(
    {}
  )
  const [currentImage, setCurrentImage] = useState(0)

  const sliderRef = useRef<HTMLDivElement>(null)
  const { id, configuration } = useParams()
  const isMobile = useIsMobile()
  const { addItem } = useCartStore()

  // Components Selected
  const [screenSelected, setScreenSelected] = useState<number>(0)
  const [processorSelected, setProcessorSelected] = useState<number>(0)
  const [ramSelected, setRamSelected] = useState<number>(0)
  const [storageSelected, setStorageSelected] = useState<number>(0)
  const [graphicCardSelected, setGraphicCardSelected] = useState<number>(0)

  // Delivery Selected
  const [deliverySelected, setDeliverySelected] =
    useState<string>("Same-day delivery")

  const deliveries = {
    sameDay: "Same-day delivery",
    nextDay: "Next day delivery",
    standard: "Standard delivery"
  }

  useEffect(() => {
    const fetchLaptopData = async () => {
      try {
        if (id) {
          const fetchedLaptop = await fetchLaptop(id)

          if (fetchedLaptop) {
            const sortedLaptop = {
              ...fetchedLaptop,
              screens:
                fetchedLaptop.screens?.sort((a, b) => a.size - b.size) || [],
              rams:
                fetchedLaptop.rams?.sort((a, b) => a.capacity - b.capacity) ||
                []
            }
            setLaptop(sortedLaptop)

            setLaptopPrice(sortedLaptop.price)
          }
        }

        if (configuration) {
          const { data: configurationData, error: errorConfiguration } =
            await supabase
              .from("laptop_configurations_table")
              .select("*")
              .eq("configuration_id", configuration)
              .single()

          setLaptopConfiguration(configurationData ? configurationData : {})
          if (errorConfiguration) {
            console.error(errorConfiguration)
          }
        }
      } catch (err) {
        console.error(err)
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
      setDeliveryIcons(loadedImages)
    }

    fetchLaptopData()
    loadIcons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const scrollToImage = (index: number) => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth
      sliderRef.current.scrollTo({
        left: width * index,
        behavior: "smooth"
      })
      setCurrentImage(index)
    }
  }

  useEffect(() => {
    const slider = sliderRef.current

    const handleScroll = () => {
      if (slider) {
        const width = slider.clientWidth
        const scrollPosition = slider.scrollLeft
        const index = Math.round(scrollPosition / width)

        if (index !== currentImage) {
          setCurrentImage(index)
        }
      }
    }

    if (slider) {
      slider.addEventListener("scroll", handleScroll)

      return () => {
        slider.removeEventListener("scroll", handleScroll)
      }
    }
  }, [currentImage, laptop])

  useEffect(() => {
    if (laptopConfiguration && laptop) {
      const screenIndex = laptop.screens.findIndex(
        (screen) => screen.size === laptopConfiguration.screen
      )
      const ramIndex = laptop.rams.findIndex(
        (ram) => ram.capacity === laptopConfiguration.ram
      )
      const storageIndex = laptop.storages.findIndex(
        (storage) =>
          `${storage.capacity}${storage.capacity_unit} ${storage.type}` ===
          laptopConfiguration.storage
      )
      const processorIndex = laptop.processors.findIndex(
        (processor) => processor.model === laptopConfiguration.processor
      )
      const graphicCardIndex = laptop.graphicCards
        ? laptop.graphicCards.findIndex(
            (graphicCard) =>
              graphicCard.model === laptopConfiguration.graphic_card
          )
        : 0

      setScreenSelected(screenIndex !== -1 ? screenIndex : 0)
      setRamSelected(ramIndex !== -1 ? ramIndex : 0)
      setStorageSelected(storageIndex !== -1 ? storageIndex : 0)
      setProcessorSelected(processorIndex !== -1 ? processorIndex : 0)
      setGraphicCardSelected(graphicCardIndex !== -1 ? graphicCardIndex : 0)
    }
  }, [laptopConfiguration, laptop])

  useEffect(() => {
    if (laptop) {
      const {
        screens,
        rams,
        storages,
        processors,
        graphicCards,
        brand,
        model
      } = laptop

      const screenPrice = screens?.[screenSelected]?.price_adjustment || 0
      const ramPrice = rams?.[ramSelected]?.price_adjustment || 0
      const storagePrice = storages?.[storageSelected]?.price_adjustment || 0
      const processorPrice =
        processors?.[processorSelected]?.price_adjustment || 0
      const graphicCardPrice =
        graphicCards?.[graphicCardSelected ?? 0]?.price_adjustment || 0

      const totalPrice =
        laptop.price +
        screenPrice +
        ramPrice +
        storagePrice +
        processorPrice +
        graphicCardPrice

      setLaptopPrice(totalPrice)
      setLaptopName(
        `${brand} - ${model} - ${screens?.[screenSelected].size}" - ${processors?.[processorSelected].brand} ${processors?.[processorSelected].model} with ${rams?.[ramSelected].capacity}GB Memory - ${storages?.[storageSelected].capacity} ${storages?.[storageSelected].capacity_unit} ${storages?.[storageSelected].type}`
      )
    }
  }, [
    screenSelected,
    processorSelected,
    ramSelected,
    storageSelected,
    graphicCardSelected,
    laptop
  ])

  return (
    <div className="p-3 font-baloo font-medium leading-none">
      {laptop && laptop.images ? (
        <>
          {isMobile ? (
            <section className="flex w-full flex-col items-center">
              <h1 className="text-justified">{laptopName}</h1>

              <div className="relative p-3">
                <div
                  ref={sliderRef}
                  className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
                >
                  {laptop.images.map((image, index) => (
                    <div key={index} className="min-w-full snap-center">
                      <img
                        src={image}
                        alt={`Laptop ${index}`}
                        className="mx-auto w-80"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 mt-2 flex w-full justify-center gap-2">
                  {laptop.images.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => scrollToImage(index)}
                      className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-300 ${
                        index === currentImage ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="my-3 flex h-16 w-96 max-w-[95%] flex-col justify-center rounded-lg bg-[#d9e3f5] p-2 text-center">
                <p className="text-2xl font-semibold leading-none">
                  ${laptopPrice}
                  <br />
                  <span className="text-base font-normal">
                    One-Time Payment
                  </span>
                </p>
              </div>

              <div className="mb-3 w-96 max-w-[95%] rounded-lg bg-[#d9e3f5] p-2 text-center">
                <p className="text-2xl font-semibold leading-none">
                  ${(laptopPrice! / 6).toFixed(2)}
                  <br />
                  <span className="text-sm font-normal">
                    Suggested Payments with 6-months Financing
                  </span>
                </p>
              </div>

              <p className="my-3 text-sm font-normal leading-none">
                {laptop.description}
              </p>
            </section>
          ) : (
            <section className="flex items-center justify-center md:gap-x-10 lg:gap-x-20">
              <div className="flex w-fit flex-col gap-y-4">
                {laptop.images.map((image, index) => {
                  return (
                    <button
                      key={image}
                      onClick={() => setCurrentImage(index)}
                      className="h-20 w-20 rounded-xl border bg-white p-1"
                    >
                      <img src={image} alt="image" />
                    </button>
                  )
                })}
              </div>

              <div className="h-auto bg-white md:w-[20rem] lg:w-[30rem]">
                <img src={laptop.images[currentImage]} />
              </div>

              <div className="w-80">
                <h1 className="text-justified">{laptopName}</h1>

                <div className="my-3 mr-auto w-52 rounded-2xl bg-gray-200 px-5 py-2 text-center">
                  <button className="h-16">
                    <p className="text-sm font-light leading-none">
                      <span className="text-2xl font-semibold">
                        ${laptopPrice!.toFixed(2)}
                      </span>
                      <br />
                      One-Time payment
                    </p>
                  </button>

                  <div className="flex items-center justify-center">
                    <div className="h-[0.5px] w-full bg-black" />
                    <span>Or</span>
                    <div className="h-[0.5px] w-full bg-black" />
                  </div>

                  <button className="h-16">
                    <p className="mx-auto text-sm font-light leading-none">
                      <span className="text-2xl font-semibold">
                        ${(laptopPrice! / 6).toFixed(2)}
                      </span>
                      <br />
                      Suggested Payments with 6-months financing
                    </p>
                  </button>
                </div>

                <p className="text-justify font-light leading-5">
                  {laptop.description}
                </p>
              </div>
            </section>
          )}

          <section className="mx-auto md:flex md:justify-center">
            <div className="mb-4 md:w-[30rem] lg:w-[45rem]">
              <h2 className="border-b border-b-blue-main px-4 py-1 text-lg font-semibold text-blue-main">
                Customize
              </h2>

              {/* Screen Size Selection */}
              <div className="mt-5 flex items-center gap-x-5 md:block">
                <span className="block md:mb-2">Screen size</span>
                <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                  {laptop
                    .screens!.sort((a, b) => a.size - b.size)
                    .map((screen, index) => (
                      <button
                        key={screen.size}
                        onClick={() => setScreenSelected(index)}
                        className={`min-w-max rounded-lg border border-blue-main p-2 ${
                          screenSelected === index
                            ? "bg-blue-main text-white"
                            : "bg-white text-blue-main"
                        }`}
                      >
                        {screen.size}"
                      </button>
                    ))}
                </div>
              </div>

              {/* Processor Selection */}
              <div className="mt-5 flex items-center gap-x-5 md:block">
                <span className="md:mb-2 md:block">Processor</span>
                <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                  {laptop.processors!.map((processor, index) => (
                    <button
                      key={processor.model}
                      onClick={() => {
                        setProcessorSelected(index)
                      }}
                      className={`min-w-max rounded-lg border border-blue-main p-2 ${
                        processorSelected === index
                          ? "bg-blue-main text-white"
                          : "bg-white text-blue-main"
                      }`}
                    >
                      {processor.brand} {processor.model}
                    </button>
                  ))}
                </div>
              </div>

              {/* RAM Selection */}
              <div className="mt-5 flex items-center gap-x-5 md:block">
                <span className="md:mb-2 md:block">RAM</span>
                <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                  {laptop.rams!.map((ram, index) => (
                    <button
                      key={ram.capacity}
                      onClick={() => setRamSelected(index)}
                      className={`min-w-max rounded-lg border border-blue-main p-2 ${
                        ramSelected === index
                          ? "bg-blue-main text-white"
                          : "bg-white text-blue-main"
                      }`}
                    >
                      {ram.capacity}GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Selection */}
              <div className="mt-5 flex items-center gap-x-5 md:block">
                <span className="md:mb-2 md:block">Storage</span>
                <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                  {laptop.storages!.map((storage, index) => (
                    <button
                      key={storage.capacity}
                      onClick={() => setStorageSelected(index)}
                      className={`min-w-max rounded-lg border border-blue-main p-2 ${
                        storageSelected === index
                          ? "bg-blue-main text-white"
                          : "bg-white text-blue-main"
                      }`}
                    >
                      {storage.capacity}
                      {storage.capacity_unit} {storage.type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphic Card Selection */}
              <div className="mt-5 flex items-center gap-x-5 md:block">
                <span className="md:mb-2 md:block">Graphics</span>
                <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                  {laptop.graphicCards && laptop.graphicCards.length > 0 ? (
                    laptop.graphicCards.map((graphicCard, index) => (
                      <button
                        key={graphicCard.model}
                        onClick={() => setGraphicCardSelected(index)}
                        className={`min-w-max rounded-lg border border-blue-main p-2 ${
                          graphicCardSelected === index
                            ? "bg-blue-main text-white"
                            : "bg-white text-blue-main"
                        }`}
                      >
                        {graphicCard.brand} {graphicCard.model}
                      </button>
                    ))
                  ) : (
                    <span>Integrated with the processor</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pl-5">
              <div className="mx-auto my-5 flex w-[95%] max-w-[28rem] justify-center gap-x-2">
                {Object.entries(deliveries).map(([key, value]) => {
                  return (
                    <button
                      onClick={() => setDeliverySelected(value)}
                      key={key}
                      className={`flex w-1/4 flex-col items-center justify-center gap-y-1 rounded-xl border border-blue-main p-1 ${deliverySelected === value ? "bg-blue-main text-white" : "bg-white text-blue-main"}`}
                    >
                      <div
                        className={`flex items-center justify-center rounded-full bg-white p-2 ${deliverySelected === value ? "bg-blue-main text-white" : "bg-white text-blue-main"}`}
                      >
                        {value && (
                          <img
                            src={deliveryIcons[key]}
                            alt={value}
                            className="h-8"
                          />
                        )}
                      </div>
                      <p className="w-16 text-center text-sm leading-none">
                        {value}
                      </p>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => {
                  if (laptop.images && id) {
                    addItem({
                      id,
                      name: laptopName,
                      price: laptopPrice,
                      quantity: 1,
                      url_photo: laptop.images[0]
                    })

                    toast({
                      description: "Item added to cart",
                      style: {
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        fontWeight: "bold",
                        border: "none"
                      },
                      duration: 900
                    })
                  }
                }}
                className="mx-auto mb-4 block w-80 rounded-xl bg-orange-main py-3 text-2xl text-white"
              >
                ADD TO CART
              </button>
            </div>
          </section>
        </>
      ) : (
        <LaptopSkeleton />
      )}
    </div>
  )
}

export default Laptop

import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import fetchLaptop, { LaptopInformation } from "../../utils/fetchLaptop"
import { useIsMobile } from "../../hooks/useIsMobile"

const Laptop = () => {
  const [laptop, setLaptop] = useState<LaptopInformation | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const { id } = useParams()
  const isMobile = useIsMobile()
  const [deliveryIcons, setDeliveryIcons] = useState<{ [key: string]: string }>(
    {}
  )

  // Components Selected
  const [screenSelected, setScreenSelected] = useState<null | number>(null)
  const [processorSelected, setProcessorSelected] = useState<null | string>(
    null
  )
  const [ramSelected, setRamSelected] = useState<null | number>(null)
  const [storageSelected, setStorageSelected] = useState<null | string>(null)
  const [graphicCardSelected, setGraphicCard] = useState<null | string>(null)

  // Delivery Selected
  const [deliverySelected, setDeliverySelected] = useState<null | string>(null)

  const deliveries = {
    pickUp: "Pick-up in store",
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
                [],
              storages:
                fetchedLaptop.storages?.sort(
                  (a, b) => a.capacity - b.capacity
                ) || []
            }

            setLaptop(sortedLaptop)

            setScreenSelected(sortedLaptop.screens[0]?.size || null)
            setProcessorSelected(sortedLaptop.processors?.[0]?.model || null)
            setRamSelected(sortedLaptop.rams[0]?.capacity || null)
            setStorageSelected(
              sortedLaptop.storages[0]?.capacity.toString() || null
            )
            setGraphicCard(
              sortedLaptop.graphicCards?.[0]?.model ||
                "Integrated with the processor"
            )
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

  return (
    <div className="p-3 font-baloo font-medium leading-none">
      {laptop && laptop.images && isMobile ? (
        <>
          <section className="flex flex-col items-center">
            <h1>
              {laptop.brand} - {laptop.model} - {laptop.screens?.[0].size}" -{" "}
              {laptop.processors?.[0].brand} {laptop.processors?.[0].model} with{" "}
              {laptop.rams?.[0].capacity}GB Memory -{" "}
              {laptop.storages?.[0].capacity}
              {laptop.storages?.[0].capacity_unit} {laptop.storages?.[0].type}
            </h1>

            {/* Images horizontal scroll */}
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

              {/* Navigation circles images */}
              <div className="absolute bottom-0 mt-2 flex w-full justify-center gap-2">
                {laptop.images.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => scrollToImage(index)} // Navegar a la imagen clickeada
                    className={`h-2 w-2 cursor-pointer rounded-full transition-colors duration-300 ${
                      index === currentImage ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="my-3 flex h-16 w-96 max-w-[95%] flex-col justify-center rounded-lg bg-[#d9e3f5] p-2 text-center">
              <p className="text-2xl font-semibold leading-none">
                ${laptop.price}
                <br />
                <span className="text-base font-normal">One-Time Payment</span>
              </p>
            </div>

            <div className="mb-3 w-96 max-w-[95%] rounded-lg bg-[#d9e3f5] p-2 text-center">
              <p className="text-2xl font-semibold leading-none">
                ${(Number(laptop.price) / 6).toFixed(2)}
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

          {/* Customization Section */}
          <section>
            <h2 className="border-b border-b-blue-main px-4 py-1 text-lg font-semibold text-blue-main">
              Customize
            </h2>

            {/* Screen Size Selection */}
            <div className="mt-5 flex items-center gap-x-5">
              <span>Screen size</span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {laptop
                  .screens!.sort((a, b) => a.size - b.size)
                  .map((screen) => (
                    <button
                      key={screen.size}
                      onClick={() => setScreenSelected(screen.size)}
                      className={`min-w-max rounded-lg border border-blue-main p-2 ${
                        screenSelected === screen.size
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
            <div className="mt-5 flex items-center gap-x-5">
              <span>Processor</span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {laptop.processors!.map((processor) => (
                  <button
                    key={processor.model}
                    onClick={() => setProcessorSelected(processor.model)}
                    className={`min-w-max rounded-lg border border-blue-main p-2 ${
                      processorSelected === processor.model
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
            <div className="mt-5 flex items-center gap-x-5">
              <span>RAM</span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {laptop.rams!.map((ram) => (
                  <button
                    key={ram.capacity}
                    onClick={() => setRamSelected(ram.capacity)}
                    className={`min-w-max rounded-lg border border-blue-main p-2 ${
                      ramSelected === ram.capacity
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
            <div className="mt-5 flex items-center gap-x-5">
              <span>Storage</span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {laptop.storages!.map((storage) => (
                  <button
                    key={storage.capacity}
                    onClick={() =>
                      setStorageSelected(storage.capacity.toString())
                    }
                    className={`min-w-max rounded-lg border border-blue-main p-2 ${
                      storageSelected === storage.capacity.toString()
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
            <div className="mt-5 flex items-center gap-x-5">
              <span>Graphics</span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {laptop.graphicCards && laptop.graphicCards.length > 0 ? (
                  laptop.graphicCards.map((graphicCard) => (
                    <button
                      key={graphicCard.model}
                      onClick={() => setGraphicCard(graphicCard.model)}
                      className={`min-w-max rounded-lg border border-blue-main p-2 ${
                        graphicCardSelected === graphicCard.model
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

            {/* Delivery section */}
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

            <button className="mx-auto block w-80 rounded-xl bg-orange-main py-3 text-2xl text-white">
              ADD TO CART
            </button>
          </section>
        </>
      ) : (
        <div>
          <section className="flex flex-col items-center">
            {/* Skeleton for Laptop Title */}
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-300"></div>

            {/* Skeleton for Image */}
            <div className="relative p-3">
              <div className="flex">
                <div className="min-w-full snap-center">
                  <div className="mx-auto h-48 w-80 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Skeleton for Price */}
            <div className="my-3 h-12 w-48 animate-pulse rounded bg-gray-300"></div>
          </section>

          <section className="mt-5">
            <h2 className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-300"></h2>

            {/* Skeleton for Screen Size */}
            <div className="mb-4 flex items-center gap-x-5">
              <span className="h-5 w-20 animate-pulse rounded bg-gray-300"></span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-20 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton for Processor */}
            <div className="mb-4 flex items-center gap-x-5">
              <span className="h-5 w-20 animate-pulse rounded bg-gray-300"></span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-32 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton for RAM */}
            <div className="mb-4 flex items-center gap-x-5">
              <span className="h-5 w-20 animate-pulse rounded bg-gray-300"></span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-16 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton for Storage */}
            <div className="mb-4 flex items-center gap-x-5">
              <span className="h-5 w-20 animate-pulse rounded bg-gray-300"></span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-28 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton for Graphics */}
            <div className="mb-4 flex items-center gap-x-5">
              <span className="h-5 w-20 animate-pulse rounded bg-gray-300"></span>
              <div className="no-scrollbar flex gap-x-3 overflow-x-auto">
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-32 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Laptop

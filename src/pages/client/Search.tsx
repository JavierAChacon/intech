import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { supabase } from "../../supabase"
import { Link } from "react-router-dom"
import useCartStore from "@/store"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "react-router-dom"

interface Laptop {
  id: string
  configuration_id: string
  brand: string
  model: string
  category: "Student" | "Office" | "Creative" | "Gaming"
  graphic_card: string
  processor: string
  ram: string
  screen: string
  storage: string
  price: number
  image_url: string
}

interface CheckedItems {
  [key: string]: boolean
}

const categories = ["Office", "Student", "Creative", "Gaming"]

const initializeCheckedItems = (items: string[]): CheckedItems =>
  items.reduce((acc, item) => ({ ...acc, [item]: false }), {})

const Search = () => {
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        // fetch laptops
        const { data: laptopsFetched, error: laptopsError } = await supabase
          .from("laptop_configurations_table")
          .select("*")

        if (laptopsError) {
          console.error(laptopsError)
        }

        const uniqueLaptopsId = Array.from(
          new Set(laptopsFetched?.map((laptop) => laptop.id))
        )
        const fileUrls = await Promise.all(
          uniqueLaptopsId.map(async (id) => {
            const { data, error } = await supabase.storage
              .from("laptops")
              .list(`${id}/`, { limit: 1 })
            if (error) {
              console.error(error)
              return
            }

            const fileName = data[0].name
            const { data: publicURL } = supabase.storage
              .from("laptops")
              .getPublicUrl(`${id}/${fileName}`)
            return { id, url: publicURL.publicUrl }
          })
        )

        const laptopsWithUrls = laptopsFetched?.map((laptop) => {
          const fileUrl = fileUrls.find((file) => file?.id === laptop.id)?.url
          return { ...laptop, image_url: fileUrl }
        })

        setLaptops(laptopsWithUrls ? laptopsWithUrls : [])

        // Fetch brands
        const { data: brandsFetched, error: brandError } = await supabase
          .from("brands")
          .select("brand")

        if (brandError) {
          console.error(brandError)
        }

        setBrands(
          brandsFetched
            ? brandsFetched.map(
                (brandItem: { brand: string }) => brandItem.brand
              )
            : []
        )

        // Fetch RAM
        const { data: ramsFetched, error: ramError } = await supabase
          .from("ram")
          .select("capacity")

        if (ramError) {
          console.error(ramError)
        }

        setRams(
          ramsFetched
            ? ramsFetched
                .map((ramItem: { capacity: string }) => ramItem.capacity)
                .sort((a, b) => parseInt(a) - parseInt(b))
            : []
        )

        // Fetch storage
        const { data: storagesFetched, error: storageError } = await supabase
          .from("storages")
          .select("storage")

        if (storageError) {
          console.error(storageError)
        }

        setStorages(
          storagesFetched
            ? storagesFetched
                .map((storageItem: { storage: string }) => storageItem.storage)
                .sort((a, b) => {
                  const parseStorage = (storage: string) => {
                    if (storage.includes("TB")) {
                      return parseInt(storage) * 1024
                    }
                    return parseInt(storage)
                  }
                  return parseStorage(a) - parseStorage(b)
                })
            : []
        )

        // Fetch screens
        const { data: screensFetched, error: screenError } = await supabase
          .from("screen")
          .select("size")

        if (screenError) {
          console.error(screenError)
        }

        setScreens(
          screensFetched
            ? screensFetched
                .map((screenItem: { size: string }) => screenItem.size)
                .sort((a, b) => parseFloat(a) - parseFloat(b))
            : []
        )

        // Fetch processor
        const { data: processorsFetched, error: processorError } =
          await supabase.from("processors").select("processor")

        if (processorError) {
          console.error(processorError)
        }

        setProcessors(
          processorsFetched
            ? processorsFetched.map(
                (processorItem: { processor: string }) =>
                  processorItem.processor
              )
            : []
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchLaptops()
  }, [])

  const { addItem } = useCartStore()
  const { toast } = useToast()
  const { option } = useParams()

  const [laptops, setLaptops] = useState<Laptop[]>([])

  const [brands, setBrands] = useState<string[]>([])
  const [brandsChecked, setBrandsChecked] = useState<CheckedItems>(
    initializeCheckedItems(brands)
  )
  const [processors, setProcessors] = useState<string[]>([])
  const [processorsChecked, setProcessorsChecked] = useState<CheckedItems>(
    initializeCheckedItems(processors)
  )

  const [rams, setRams] = useState<string[]>([])
  const [ramsChecked, setRamsChecked] = useState<CheckedItems>(
    initializeCheckedItems(rams)
  )

  const [storages, setStorages] = useState<string[]>([])
  const [storagesChecked, setStoragesChecked] = useState<CheckedItems>(
    initializeCheckedItems(storages)
  )

  const [screens, setScreens] = useState<string[]>([])
  const [screensChecked, setScreensChecked] = useState<CheckedItems>(
    initializeCheckedItems(screens)
  )

  const [categoriesChecked, setCategoriesChecked] = useState<CheckedItems>(
    initializeCheckedItems(categories)
  )

  const [minPrice, setMinPrice] = useState<number | string>("")
  const [maxPrice, setMaxPrice] = useState<number | string>("")

  const handleItemChange = (
    setChecked: React.Dispatch<React.SetStateAction<CheckedItems>>,
    item: string
  ): void => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="flex gap-x-4 p-4 font-baloo">
      <Accordion
        type="multiple"
        defaultValue={option ? [option] : []}
        className="w-48 rounded-2xl border-b border-r border-t border-blue-main px-2 max-lg:hidden"
      >
        <AccordionItem value="categories">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <label>
                    <input
                      type="checkbox"
                      checked={categoriesChecked[category]}
                      onChange={() =>
                        handleItemChange(setCategoriesChecked, category)
                      }
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <ul>
              {brands.map((brand) => (
                <li key={brand}>
                  <label>
                    <input
                      type="checkbox"
                      checked={brandsChecked[brand]}
                      onChange={() => handleItemChange(setBrandsChecked, brand)}
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="RAM">
          <AccordionTrigger>RAM</AccordionTrigger>
          <AccordionContent>
            <ul>
              {rams.map((ram) => (
                <li key={ram}>
                  <label>
                    <input
                      type="checkbox"
                      checked={ramsChecked[ram]}
                      onChange={() => handleItemChange(setRamsChecked, ram)}
                    />
                    {ram}GB
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="storages">
          <AccordionTrigger>Storage</AccordionTrigger>
          <AccordionContent>
            <ul>
              {storages.map((storage) => (
                <li key={storage}>
                  <label>
                    <input
                      type="checkbox"
                      checked={storagesChecked[storage]}
                      onChange={() =>
                        handleItemChange(setStoragesChecked, storage)
                      }
                    />
                    {storage}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="screens">
          <AccordionTrigger>Screen</AccordionTrigger>
          <AccordionContent>
            <ul>
              {screens.map((screen) => (
                <li key={screen}>
                  <label>
                    <input
                      type="checkbox"
                      checked={screensChecked[screen]}
                      onChange={() =>
                        handleItemChange(setScreensChecked, screen)
                      }
                    />
                    {screen}"
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="processors">
          <AccordionTrigger>Processor</AccordionTrigger>
          <AccordionContent>
            <ul>
              {processors.map((processor) => (
                <li key={processor}>
                  <label>
                    <input
                      type="checkbox"
                      checked={processorsChecked[processor]}
                      onChange={() =>
                        handleItemChange(setProcessorsChecked, processor)
                      }
                    />
                    {processor}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value ? parseInt(e.target.value) : "")
                }
                placeholder="Min"
                className="w-1/2 rounded border px-2 py-1"
              />

              <span>to</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? parseInt(e.target.value) : "")
                }
                placeholder="Max"
                className="w-1/2 rounded border px-2 py-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-1 flex-col gap-y-6">
        {laptops.map((laptop) => {
          const {
            image_url,
            brand,
            model,
            price,
            id,
            screen,
            processor,
            ram,
            storage,
            configuration_id
          } = laptop
          const laptopName = `${brand} ${model} - ${screen}" - ${processor} with ${ram}GB Memory - ${storage}`

          return (
            <div key={laptopName} className="border-b-2 border-black p-3">
              <Link to={`${id}/${configuration_id}`} className="flex gap-x-4">
                <div>
                  <img
                    src={image_url}
                    alt={laptopName}
                    className="w-96 lg:w-40"
                  />
                </div>

                <div className="flex flex-col justify-between lg:w-[35rem]">
                  <h3 className="lg:text-justify lg:text-lg">{laptopName}</h3>

                  <div className="w-fit space-y-1 lg:ml-auto lg:text-right">
                    <span className="font-semibold lg:text-2xl">
                      ${price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  addItem({
                    id,
                    name: laptopName,
                    price,
                    url_photo: image_url,
                    quantity: 1
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
                }}
                className="ml-[40rem] mt-2 block rounded-lg bg-orange-main px-2 py-1 text-white"
              >
                Add to cart
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Search

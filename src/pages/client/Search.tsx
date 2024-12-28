import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Link } from "react-router-dom"
import { useCartStore, useConfigurationsStore } from "@/store"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "react-router-dom"
import { Dialog } from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import fetchConfigurations from "@/utils/fetchConfigurations"

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

const initializeCheckedItems = (items: string[]): CheckedItems =>
  items.reduce((acc, item) => ({ ...acc, [item]: false }), {})

const Search = () => {
  const { configurations } = useConfigurationsStore()

  useEffect(() => {
    if (configurations.length === 0) {
      fetchConfigurations()
    }

    setBrands(
      Array.from(new Set(configurations.map((item) => item.brand).sort()))
    )

    setRams(
      Array.from(new Set(configurations.map((item) => `${item.ram}`))).sort(
        (a, b) => parseInt(a) - parseInt(b)
      )
    )

    setProcessors(
      Array.from(new Set(configurations.map((item) => item.processor))).sort()
    )

    setStorages(
      Array.from(new Set(configurations.map((item) => item.storage))).sort()
    )

    setScreens(
      Array.from(
        new Set(configurations.map((item) => `${item.screen}"`))
      ).sort()
    )
  }, [configurations])

  const { addItem } = useCartStore()
  const { toast } = useToast()
  const { option } = useParams()

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

  const categories = ["Student", "Office", "Creative", "Gaming"]

  const [categoriesChecked, setCategoriesChecked] = useState<CheckedItems>(
    initializeCheckedItems(categories)
  )

  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null)

  const filterConfigs = [
    {
      title: "Price",
      value: "price",
      description: "prices",
      options: screens,
      optionsChecked: screensChecked,
      setChecked: setScreensChecked
    },
    {
      title: "Category",
      value: "categories",
      description: "categories",
      options: categories,
      optionsChecked: categoriesChecked,
      setChecked: setCategoriesChecked
    },
    {
      title: "Brand",
      value: "brands",
      description: "brands",
      options: brands,
      optionsChecked: brandsChecked,
      setChecked: setBrandsChecked
    },
    {
      title: "RAM",
      value: "rams",
      description: "RAM sizes",
      options: rams,
      optionsChecked: ramsChecked,
      setChecked: setRamsChecked
    },
    {
      title: "Processor",
      value: "processors",
      description: "processors",
      options: processors,
      optionsChecked: processorsChecked,
      setChecked: setProcessorsChecked
    },
    {
      title: "Storage",
      value: "storages",
      description: "storage options",
      options: storages,
      optionsChecked: storagesChecked,
      setChecked: setStoragesChecked
    },
    {
      title: "Screen",
      value: "screens",
      description: "screen sizes",
      options: screens,
      optionsChecked: screensChecked,
      setChecked: setScreensChecked
    }
  ]

  const handleItemChange = (
    setChecked: React.Dispatch<React.SetStateAction<CheckedItems>>,
    item: string
  ): void => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const [filteredLaptops, setFilteredLaptops] =
    useState<Laptop[]>(configurations)

  useEffect(() => {
    const activeCategories = Object.keys(categoriesChecked).filter(
      (category) => categoriesChecked[category]
    )

    const activeBrands = Object.keys(brandsChecked).filter(
      (brand) => brandsChecked[brand]
    )

    const activeRams = Object.keys(ramsChecked).filter(
      (ram) => ramsChecked[ram]
    )

    const activeStorages = Object.keys(storagesChecked).filter(
      (storage) => storagesChecked[storage]
    )

    const activeScreens = Object.keys(screensChecked).filter(
      (screen) => screensChecked[screen]
    )

    const activeProcessors = Object.keys(processorsChecked).filter(
      (processor) => processorsChecked[processor]
    )

    if (sortOrder !== null) {
      setFilteredLaptops(
        configurations.sort((a, b) => {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price
        })
      )
    }

    const filtered = configurations.filter((laptop) => {
      const matchesCategory =
        activeCategories.length === 0 ||
        activeCategories.includes(laptop.category)
      const matchesBrand =
        activeBrands.length === 0 || activeBrands.includes(laptop.brand)
      const matchesRam =
        activeRams.length === 0 || activeRams.includes(laptop.ram)
      const matchesStorage =
        activeStorages.length === 0 || activeStorages.includes(laptop.storage)
      const matchesScreen =
        activeScreens.length === 0 ||
        activeScreens.includes(`${laptop.screen}"`)
      const matchesProcessor =
        activeProcessors.length === 0 ||
        activeProcessors.includes(laptop.processor)

      const matchesPrice =
        (!minPrice || laptop.price >= minPrice) &&
        (!maxPrice || laptop.price <= maxPrice)

      return (
        matchesCategory &&
        matchesBrand &&
        matchesRam &&
        matchesStorage &&
        matchesScreen &&
        matchesProcessor &&
        matchesPrice
      )
    })

    setFilteredLaptops(filtered)
  }, [
    categoriesChecked,
    configurations,
    brandsChecked,
    ramsChecked,
    storagesChecked,
    screensChecked,
    processorsChecked,
    minPrice,
    maxPrice,
    sortOrder
  ])

  return (
    <div className="flex flex-col gap-x-4 p-4 font-baloo lg:flex-row">
      <div className="no-scrollbar flex gap-4 overflow-x-scroll lg:hidden">
        {filterConfigs.map((filter) => {
          const {
            title,
            description,
            options,
            optionsChecked,
            setChecked,
            value
          } = filter

          return (
            <Dialog key={title}>
              <DialogTrigger asChild>
                <button
                  className={`rounded-xl border bg-[#D9E3F5] px-3 py-1 ${title === "Price" && "text-blue-main"}`}
                >
                  {title}
                </button>
              </DialogTrigger>
              <DialogContent className="w-80">
                <DialogTitle className="text-lg font-bold">
                  Select filter by {title}
                  <DialogDescription>
                    Select the {description} you want to filter laptops by
                  </DialogDescription>
                </DialogTitle>
                <div className="grid gap-4 py-4">
                  {value === "price" ? (
                    <>
                      <div>
                        <div className="mb-4 flex items-center gap-x-2">
                          <Input
                            type="number"
                            autoFocus={false}
                            value={minPrice ?? ""}
                            onChange={(e) =>
                              setMinPrice(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            placeholder="Min"
                            className="w-1/2 rounded border px-2 py-1"
                          />
                          <span>to</span>
                          <Input
                            type="number"
                            value={maxPrice ?? ""}
                            onChange={(e) =>
                              setMaxPrice(
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            placeholder="Max"
                            className="w-1/2 rounded border px-2 py-1"
                          />
                        </div>

                        <Select
                          onValueChange={(value) => {
                            setSortOrder(value as "asc" | "desc")
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose sort order" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    options.map((option, index) => (
                      <div key={option} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          id={`${title}-${index}`}
                          checked={optionsChecked[option]}
                          onChange={() => handleItemChange(setChecked, option)}
                        />
                        <label
                          htmlFor={`${title}-${index}`}
                          className="text-sm"
                        >
                          {option}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>

      <Accordion
        key={option}
        type="multiple"
        defaultValue={option ? [option] : undefined}
        className="w-48 rounded-2xl border-b border-r border-t border-blue-main px-2 max-lg:hidden"
      >
        {filterConfigs.map((filter) => {
          const { title, value, options, optionsChecked, setChecked } = filter

          return (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                {value === "price" ? (
                  <>
                    <div className="mb-4 flex items-center gap-x-2">
                      <input
                        type="number"
                        value={minPrice ?? ""}
                        onChange={(e) =>
                          setMinPrice(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="Min"
                        className="w-1/2 rounded border px-2 py-1"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={maxPrice ?? ""}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        placeholder="Max"
                        className="w-1/2 rounded border px-2 py-1"
                      />
                    </div>

                    <Select
                      onValueChange={(value) => {
                        setSortOrder(value as "asc" | "desc")
                      }}
                    >
                      <SelectTrigger className="mx-auto">
                        <SelectValue placeholder="Choose sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <ul>
                    {options.map((option) => (
                      <li key={option}>
                        <label>
                          <input
                            type="checkbox"
                            checked={optionsChecked[option]}
                            onChange={() =>
                              handleItemChange(setChecked, option)
                            }
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="flex flex-1 flex-col gap-y-6">
        {configurations.length > 0 ? (
          filteredLaptops.length > 0 ? (
            filteredLaptops.map((laptop) => {
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
              const laptopName = `${brand} ${model} - ${screen}" - ${processor} with ${ram} Memory - ${storage}`

              return (
                <div key={laptopName} className="border-b-2 border-black p-3">
                  <Link
                    to={`${id}/${configuration_id}`}
                    className="flex gap-x-4"
                  >
                    <div>
                      <img
                        src={image_url}
                        alt={laptopName}
                        className="w-96 lg:w-40"
                      />
                    </div>

                    <div className="flex flex-col justify-between lg:w-[35rem]">
                      <h3 className="lg:text-justify lg:text-lg">
                        {laptopName}
                      </h3>

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
                        id: configuration_id,
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
                    className="ml-32 mt-2 block rounded-lg bg-orange-main px-2 py-1 text-white lg:ml-[40rem]"
                  >
                    Add to cart
                  </button>
                </div>
              )
            })
          ) : (
            <div className="mt-2 text-center text-lg">
              No laptops found matching the selected filters.
            </div>
          )
        ) : (
          <div className="animate-pulse">
            {[...Array(25)].map((_, index) => (
              <div key={index} className="border-b-2 border-black p-3">
                <div className="flex gap-x-4">
                  <div className="h-40 w-96 bg-gray-300 lg:w-40"></div>
                  <div className="flex flex-col justify-between lg:w-[35rem]">
                    <div className="h-6 bg-gray-300 lg:text-justify lg:text-lg"></div>
                    <div className="w-fit space-y-1 lg:ml-auto lg:text-right">
                      <div className="h-8 bg-gray-300 lg:text-2xl"></div>
                    </div>
                  </div>
                </div>
                <div className="ml-[40rem] mt-2 h-10 w-32 rounded-lg bg-gray-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search

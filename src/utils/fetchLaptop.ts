import { supabase } from "../supabase"

export interface LaptopInformation {
  brand: string
  model: string
  description: string
  price: string
  graphicCards: { brand: string; model: string }[] | null
  processors: { brand: string; model: string }[] | null
  rams: { capacity: number }[] | null
  screens: { size: number }[] | null
  storages: { capacity: number; capacity_unit: string; type: string }[] | null
  images: string[] | null
}

const fetchLaptop = async (
  laptopId: string
): Promise<LaptopInformation | null> => {
  // Fetch laptop basic information
  const { data: laptopData, error: laptopError } = await supabase
    .from("laptop")
    .select("*")
    .eq("id", laptopId)
    .single()

  if (laptopError || !laptopData) {
    console.error("Error fetching laptop data:", laptopError)
    return null
  }

  // Desestructurar los campos específicos de laptopData
  const { brand, model, description, price } = laptopData

  // Fetch relations (IDs) for each component
  const { data: graphicCardIds, error: graphicCardRelationError } =
    await supabase
      .from("laptop_graphic_card")
      .select("graphic_card_id")
      .eq("laptop_id", laptopId)
  if (graphicCardRelationError)
    console.error("Error fetching graphic card IDs:", graphicCardRelationError)

  const { data: processorIds, error: processorRelationError } = await supabase
    .from("laptop_processor")
    .select("processor_id")
    .eq("laptop_id", laptopId)
  if (processorRelationError)
    console.error("Error fetching processor IDs:", processorRelationError)

  const { data: ramIds, error: ramRelationError } = await supabase
    .from("laptop_ram")
    .select("ram_id")
    .eq("laptop_id", laptopId)
  if (ramRelationError)
    console.error("Error fetching RAM IDs:", ramRelationError)

  const { data: screenIds, error: screenRelationError } = await supabase
    .from("laptop_screen")
    .select("screen_id")
    .eq("laptop_id", laptopId)
  if (screenRelationError)
    console.error("Error fetching screen IDs:", screenRelationError)

  const { data: storageIds, error: storageRelationError } = await supabase
    .from("laptop_storage")
    .select("storage_id")
    .eq("laptop_id", laptopId)
  if (storageRelationError)
    console.error("Error fetching storage IDs:", storageRelationError)

  // Fetching each component information

  // Fetch Graphic Cards
  const graphicCards =
    graphicCardIds && graphicCardIds.length > 0
      ? await Promise.all(
          graphicCardIds.map(async (item: { graphic_card_id: string }) => {
            const { data: graphicCard, error: graphicCardError } =
              await supabase
                .from("graphic_card")
                .select("brand, model")
                .eq("id", item.graphic_card_id)

            if (graphicCardError || !graphicCard || graphicCard.length === 0) {
              console.error(
                `Error fetching graphic card with id ${item.graphic_card_id}:`,
                graphicCardError
              )
              return null
            }

            return graphicCard[0]
          })
        ).then((results) =>
          results.filter(
            (item): item is { brand: string; model: string } => item !== null
          )
        )
      : null

  // Fetch Processors
  const processors =
    processorIds && processorIds.length > 0
      ? await Promise.all(
          processorIds.map(async (item: { processor_id: string }) => {
            const { data: processor, error: processorError } = await supabase
              .from("processor")
              .select("brand, model")
              .eq("id", item.processor_id)

            if (processorError || !processor || processor.length === 0) {
              console.error(
                `Error fetching processor with id ${item.processor_id}:`,
                processorError
              )
              return null
            }

            return processor[0]
          })
        ).then((results) =>
          results.filter(
            (item): item is { brand: string; model: string } => item !== null
          )
        )
      : null

  // Fetch RAMs
  const rams =
    ramIds && ramIds.length > 0
      ? await Promise.all(
          ramIds.map(async (item: { ram_id: string }) => {
            const { data: ram, error: ramError } = await supabase
              .from("ram")
              .select("capacity")
              .eq("id", item.ram_id)

            if (ramError || !ram || ram.length === 0) {
              console.error(
                `Error fetching RAM with id ${item.ram_id}:`,
                ramError
              )
              return null
            }

            return ram[0]
          })
        ).then((results) =>
          results.filter((item): item is { capacity: number } => item !== null)
        )
      : null

  // Fetch Screens
  const screens =
    screenIds && screenIds.length > 0
      ? await Promise.all(
          screenIds.map(async (item: { screen_id: string }) => {
            const { data: screen, error: screenError } = await supabase
              .from("screen")
              .select("size")
              .eq("id", item.screen_id)

            if (screenError || !screen || screen.length === 0) {
              console.error(
                `Error fetching screen with id ${item.screen_id}:`,
                screenError
              )
              return null
            }

            return screen[0]
          })
        ).then((results) =>
          results.filter((item): item is { size: number } => item !== null)
        )
      : null

  // Fetch Storage
  const storages =
    storageIds && storageIds.length > 0
      ? await Promise.all(
          storageIds.map(async (item: { storage_id: string }) => {
            const { data: storage, error: storageError } = await supabase
              .from("storage")
              .select("capacity, capacity_unit, type")
              .eq("id", item.storage_id)

            if (storageError || !storage || storage.length === 0) {
              console.error(
                `Error fetching storage with id ${item.storage_id}:`,
                storageError
              )
              return null
            }

            return storage[0]
          })
        ).then((results) =>
          results.filter(
            (
              item
            ): item is {
              capacity: number
              capacity_unit: string
              type: string
            } => item !== null
          )
        )
      : null

  // Fetch Images from Supabase Storage (bucket 'laptops')
  const { data: imageFiles, error: imageError } = await supabase.storage
    .from("laptops")
    .list(laptopId) // Fetch all files in the folder with the same id as the laptopId

  if (imageError) {
    console.error("Error fetching images from storage:", imageError)
  }

  const imageUrls =
    imageFiles && imageFiles.length > 0
      ? await Promise.all(
          imageFiles.map(async (file) => {
            const { data: publicUrl } = await supabase.storage
              .from("laptops")
              .getPublicUrl(`${laptopId}/${file.name}`)
            return publicUrl.publicUrl
          })
        )
      : null

  // Compile the final object with all the laptop components
  const fetchedLaptop: LaptopInformation = {
    brand,
    model,
    description,
    price,
    graphicCards,
    processors,
    rams,
    screens,
    storages,
    images: imageUrls
  }
  return fetchedLaptop
}

export default fetchLaptop

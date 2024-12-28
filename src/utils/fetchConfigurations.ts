import { supabase } from "@/supabase"
import { useConfigurationsStore } from "@/store"

const fetchConfigurations = async () => {
  const { setConfigurations } = useConfigurationsStore.getState()

  const { data: laptopsFetched, error: laptopsError } = await supabase
    .from("laptop_configurations_table")
    .select("*")

  if (laptopsError) {
    console.error(laptopsError)
    return
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

  setConfigurations(laptopsWithUrls ? laptopsWithUrls : [])
}

export default fetchConfigurations

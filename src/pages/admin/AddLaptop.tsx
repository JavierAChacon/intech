import { useForm, FormProvider, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../../components/admin/FormInput"
import { supabase } from "../../supabase"
import Loader from "../../components/admin/Loader"

const LaptopSchema = z.object({
  stock: z
    .number({ required_error: "Stock is required" })
    .int("Stock must be an integer")
    .positive("Stock must be positive"),
  brand: z.string({ required_error: "Brand is required" }),
  model: z.string({ required_error: "Model is required" }),
  category: z.enum(["Office", "Gaming", "Creative", "Student"], {
    required_error: "Category is required"
  }),
  description: z.string({ required_error: "Description is required" }),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be positive"),
  ram: z
    .number({ required_error: "Ram is required" })
    .int("Ram must be an integer"),
  graphic_card: z.object({
    brand: z.string({ required_error: "Graphic card brand is required" }),
    model: z.string({ required_error: "Graphic card model is required" })
  }),
  processor: z.object({
    brand: z.string({ required_error: "Processor brand is required" }),
    model: z.string({ required_error: "Processor model is required" })
  }),
  storage: z.object({
    capacity: z
      .number({ required_error: "Storage capacity is required" })
      .int("Storage capacity must be an integer"),
    capacity_unit: z.enum(["GB", "TB"], {
      required_error: "Storage unit is required"
    }),
    type: z.enum(["SSD", "HDD"], { required_error: "Storage type is required" })
  }),
  screen: z.object({
    size: z
      .number({ required_error: "Screen size is required" })
      .positive("Screen size must be positive"),
    tactile: z.boolean()
  }),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) =>
        !files ||
        files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        ),
      { message: "Only image files jpeg, png and jpg are allowed." }
    )
})

type LaptopSchemaType = z.infer<typeof LaptopSchema>

const AddLaptop = () => {
  const methods = useForm<LaptopSchemaType>({
    resolver: zodResolver(LaptopSchema),
    defaultValues: {
      stock: 0,
      brand: "",
      model: "",
      category: "Office",
      description: "",
      price: 0,
      ram: 0,
      graphic_card: {
        brand: "",
        model: ""
      },
      processor: {
        brand: "",
        model: ""
      },
      storage: {
        capacity: 0,
        capacity_unit: "GB",
        type: "SSD"
      },
      screen: {
        size: 0,
        tactile: false
      },
      images: []
    }
  })

  const {
    setError,
    formState: { isSubmitting }
  } = methods

  const onSubmit: SubmitHandler<LaptopSchemaType> = async (formData) => {
    const {
      stock,
      brand,
      model,
      category,
      description,
      price,
      ram,
      graphic_card,
      processor,
      storage,
      screen,
      images
    } = formData

    try {
      const { data: ramData } = await supabase
        .from("rams")
        .insert({ capacity: ram })
        .select("id")
        .single()

      const { data: graphicCardData } = await supabase
        .from("graphic_cards")
        .insert({ brand: graphic_card.brand, model: graphic_card.model })
        .select("id")
        .single()

      const { data: processorData } = await supabase
        .from("processors")
        .insert({ brand: processor.brand, model: processor.model })
        .select("id")
        .single()

      const { data: screenData } = await supabase
        .from("screens")
        .insert({ size: screen.size, tactile: screen.tactile })
        .select("id")
        .single()

      const { data: storageData } = await supabase
        .from("storages")
        .insert({
          capacity: storage.capacity,
          capacity_unit: storage.capacity_unit,
          type: storage.type
        })
        .select("id")
        .single()

      if (
        ramData &&
        graphicCardData &&
        processorData &&
        screenData &&
        storageData
      ) {
        const { data: laptopData } = await supabase
          .from("laptops")
          .insert({
            stock,
            brand,
            model,
            category,
            description,
            price,
            ram_id: ramData.id,
            graphic_card_id: graphicCardData.id,
            processor_id: processorData.id,
            screen_id: screenData.id,
            storage_id: storageData.id
          })
          .select("id")
          .single()

        if (!laptopData) {
          setError("root.serverError", {
            type: "manual",
            message: "Error inserting laptop into database."
          })
          return
        }

        const imageUrls: string[] = []
        if (Array.isArray(images)) {
          for (const image of images) {
            const { error, data } = await supabase.storage
              .from("laptops")
              .upload(`${laptopData.id}/${brand}-${model}-${Date.now()}`, image)

            if (error) {
              setError("root.serverError", {
                type: "manual",
                message: "Error uploading image to server. Please try again."
              })
              console.error(error.message)
              break
            }

            if (data) {
              const {
                data: { publicUrl }
              } = supabase.storage.from("laptops").getPublicUrl(data.path)
              if (publicUrl) {
                imageUrls.push(publicUrl)
              }
            }
          }
        }

        if (imageUrls.length > 0) {
          await supabase.from("laptop_images").insert(
            imageUrls.map((url) => ({
              laptop_id: laptopData.id,
              image_url: url
            }))
          )
        }
      }
    } catch {
      setError("root.serverError", {
        type: "manual",
        message: "An unexpected error has occurred."
      })
    }
  }
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="mb-8 flex w-full justify-evenly">
          <div className="w-80">
            <h2 className="mb-4 text-lg font-bold">Information</h2>

            <div>
              <label htmlFor="stock">Stock</label>
              <FormInput name="stock" type="number" placeholder="Enter stock" />
            </div>

            <div>
              <label htmlFor="brand">Brand</label>
              <FormInput name="brand" placeholder="Enter brand" />
            </div>

            <div>
              <label htmlFor="model">Model</label>
              <FormInput name="model" placeholder="Enter model" />
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <FormInput
                name="category"
                type="select"
                options={[
                  { value: "Student" },
                  { value: "Gaming" },
                  { value: "Creative" },
                  { value: "Office" }
                ]}
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <FormInput name="description" placeholder="Enter description" />
            </div>

            <div>
              <label htmlFor="price">Price</label>
              <FormInput
                name="price"
                type="number"
                placeholder="Enter price"
                step="0.01"
                prefix="$"
              />
            </div>
          </div>

          <div className="w-80">
            <h2 className="mb-4 text-lg font-bold">Technical Specifications</h2>

            <div>
              <label htmlFor="ram">RAM</label>
              <FormInput name="ram" type="number" placeholder="Enter RAM" />
            </div>

            <div className="mb-4">
              <label>Graphic Card</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormInput name="graphic_card.brand" placeholder="Brand" />
                </div>
                <div className="flex-1">
                  <FormInput name="graphic_card.model" placeholder="Model" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label>Processor</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormInput name="processor.brand" placeholder="Brand" />
                </div>
                <div className="flex-1">
                  <FormInput name="processor.model" placeholder="Model" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label>Storage</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormInput
                    name="storage.capacity"
                    type="number"
                    placeholder="Capacity"
                  />
                </div>
                <div className="flex-1">
                  <FormInput
                    name="storage.capacity_unit"
                    type="select"
                    options={[
                      { value: "GB", label: "GB" },
                      { value: "TB", label: "TB" }
                    ]}
                  />
                </div>
                <div className="flex-1">
                  <FormInput
                    name="storage.type"
                    type="select"
                    options={[{ value: "SSD" }, { value: "HDD" }]}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label>Screen</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <FormInput
                    name="screen.size"
                    type="number"
                    step="0.01"
                    placeholder="Size"
                  />
                </div>
                <div className="flex flex-1 items-center">
                  <FormInput
                    name="screen.tactile"
                    type="checkbox"
                    placeholder="Touchable"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="images">Images</label>
          <FormInput type="file" name="images" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-blue-200"
        >
          {isSubmitting ? <Loader /> : "Add Laptop"}
        </button>
      </form>
    </FormProvider>
  )
}

export default AddLaptop

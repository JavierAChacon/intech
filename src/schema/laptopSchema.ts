// src/schemas/laptopSchema.ts
import { z } from "zod"

export const LaptopSchema = z.object({
  stock: z
    .number({ required_error: "Stock is required" })
    .int("Stock must be an integer")
    .min(0, "Stock must be more than zero"),
  brand: z.string({ required_error: "Brand is required" }),
  model: z.string({ required_error: "Model is required" }),
  category: z.enum(["Office", "Gaming", "Creative", "Student"], {
    required_error: "Category is required"
  }),
  description: z
    .string({ required_error: "Description is required" })
    .min(15, "Description must have at least 15 characters"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be positive"),
  graphicCards: z
    .array(
      z.object({
        brand: z.string({ required_error: "Graphic card brand is required" }),
        model: z.string({ required_error: "Graphic card model is required" })
      })
    )
    .nonempty("At least one graphic card is required"),
  ram: z
    .array(
      z.object({
        capacity: z
          .number({ required_error: "RAM must be a number" })
          .int("RAM must be an integer")
      })
    )
    .nonempty("At least one RAM value is required"),
  processor: z
    .array(
      z.object({
        brand: z.string({ required_error: "Processor brand is required" }),
        model: z.string({ required_error: "Processor model is required" })
      })
    )
    .nonempty("At least one processor is required"),
  storage: z
    .array(
      z.object({
        capacity: z
          .number({ required_error: "Storage capacity is required" })
          .int("Storage capacity must be an integer"),
        capacity_unit: z.enum(["GB", "TB"], {
          required_error: "Storage unit is required"
        }),
        type: z.enum(["SSD", "HDD"], {
          required_error: "Storage type is required"
        })
      })
    )
    .nonempty("At least one storage option is required"),
  screen: z
    .array(
      z.object({
        size: z
          .number({ required_error: "Screen size is required" })
          .positive("Screen size must be positive")
      })
    )
    .nonempty("At least one screen is required"),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) =>
        !files ||
        files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
        ),
      { message: "Only image files jpeg, png, and jpg are allowed." }
    )
})

export type LaptopSchemaType = z.infer<typeof LaptopSchema>

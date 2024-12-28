import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  url_photo: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  decreaseItem: (id: string) => void
  removeItem: (id: string) => void
}

interface Configuration {
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

interface ConfigurationsState {
  configurations: Configuration[]
  setConfigurations: (configurations: Configuration[]) => void
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            }
          } else {
            return { items: [...state.items, { ...item, quantity: 1 }] }
          }
        }),
      decreaseItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
    }),
    {
      name: "cart-storage"
    }
  )
)

const useConfigurationsStore = create<ConfigurationsState>()(
  persist(
    (set) => ({
      configurations: [],
      setConfigurations: (configurations) => set({ configurations })
    }),
    {
      name: "configurations-storage"
    }
  )
)

export { useCartStore, useConfigurationsStore }

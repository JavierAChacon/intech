import useCartStore from "../../store"
import { FaRegTrashCan } from "react-icons/fa6"

const Cart = () => {
  const { items, removeItem, addItem, decreaseItem } = useCartStore()

  const subtotal = items
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2)
  const tax = (parseFloat(subtotal) * 0.16).toFixed(2)
  const shipping = (0).toFixed(2)
  const total = (
    parseFloat(subtotal) +
    parseFloat(tax) +
    parseFloat(shipping)
  ).toFixed(2)

  return (
    <div className="relative justify-center px-4 lg:mx-auto lg:mt-4 lg:flex lg:w-[80rem] lg:gap-x-4">
      <div>
        <h1 className="mb-2 border-b border-b-blue-main py-2 font-baloo text-2xl font-bold">
          Shopping Cart
        </h1>

        <div className="min-h-72">
          {items.map((item) => {
            const { id, url_photo, name, price, quantity } = item
            return (
              <div
                className="flex items-start border-b border-[#16243F] p-2"
                key={id}
              >
                <div className="w-20 flex-shrink-0">
                  <img src={url_photo} />
                </div>

                <div className="mx-4 flex-auto">
                  <h2>{name}</h2>

                  <div className="mt-2 flex w-full justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => decreaseItem(id)}
                        disabled={quantity === 1}
                        className="flex w-6 items-center justify-center rounded-l-md bg-[#16243F] text-lg font-semibold text-white disabled:bg-gray-600"
                      >
                        -
                      </button>

                      <div className="h-7 w-7 border-y border-[#16243F] px-2 text-center">
                        {quantity}
                      </div>

                      <button
                        onClick={() => addItem(item)}
                        className="flex w-6 items-center justify-center rounded-r-md bg-[#16243F] text-lg font-semibold text-white"
                      >
                        +
                      </button>
                    </div>
                    <p className="relative right-4 text-right text-lg font-semibold">
                      ${(price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button onClick={() => removeItem(id)} className="ml-auto">
                  <FaRegTrashCan className="text-2xl" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative bottom-0 right-4 w-screen rounded-t-3xl bg-[#D9E3F5] p-4 lg:static lg:h-fit lg:w-96 lg:rounded-3xl">
        <div className="mx-auto w-64">
          <div className="mb-2 rounded-xl bg-white">
            <input
              type="text"
              className="w-full rounded-2xl bg-white px-4 py-1"
              placeholder="I have a gift card / code"
            />
          </div>
          <div className="my-4 flex justify-between">
            <p className="font-medium">Subtotal</p>
            <span className="font-semibold">${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <span className="font-semibold">${shipping}</span>
          </div>
          <div className="flex justify-between border-b-2 border-b-black pb-2">
            <p>Tax</p>
            <span className="font-semibold">${tax}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <p>Total</p>
            <span className="font-semibold">${total}</span>
          </div>

          <button className="mx-auto mt-4 block w-full rounded-2xl bg-blue-main py-1 text-xl font-semibold text-white">
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart

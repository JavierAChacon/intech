import { useEffect, useState } from "react"
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitter
} from "react-icons/fa"
import onclik from "../../assets/icons/onclick.svg"

const ClientFooter = () => {
  const [clientServicesIcons, setClientServicesIcons] = useState<{
    [key: string]: string
  }>()

  const clientServices = {
    store: "Find a store",
    support: "Visit our Support center",
    checkOrder: "Check your Order Status"
  }

  useEffect(() => {
    const loadIcons = async () => {
      const loadedImages: { [key: string]: string } = {}
      for (const key of Object.keys(clientServices)) {
        try {
          const image = await import(`../../assets/icons/${key}.svg`)
          loadedImages[key] = image.default
        } catch (error) {
          console.error(`Error loading image for ${key}`, error)
        }
      }
      setClientServicesIcons(loadedImages)
    }

    loadIcons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <footer className="bg-navy p-4 font-baloo text-white">
      <div className="flex flex-col justify-center gap-y-3 border-b border-b-white px-[10%] pb-4 md:flex-row md:justify-between">
        {Object.entries(clientServices).map(([key, value]) => {
          return (
            <div className="flex items-center md:justify-center">
              <div className="w-16">
                <img
                  src={clientServicesIcons?.[key]}
                  alt={value}
                  className="h-16"
                />
              </div>
              <p className="ml-4 text-lg">{value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-3 md:grid-rows-1">
        <div className="col-span-1 row-span-1 flex flex-col gap-y-2 md:mx-auto md:w-fit">
          <h4 className="font-semibold">Order and Purcharses</h4>
          <p>Returns and Exchanges</p>
          <p>Check Order Status</p>
          <p>Giftcard</p>
        </div>

        <div className="col-span-1 row-span-1 flex flex-col gap-y-2 md:mx-auto md:w-fit">
          <h4 className="font-semibold">Help</h4>
          <p>Support Center</p>
          <p>Shop with an Expert</p>
          <p>Store Locations</p>
          <p>Contact us</p>
        </div>

        <div className="col-span-2 md:col-span-1 md:mx-auto md:w-fit">
          <h4 className="mb-4 text-center font-semibold underline md:text-left md:no-underline">
            Sign Up or Create an Account
          </h4>

          <div>
            <label className="ml-[5%] font-bold md:ml-0">
              Sign Up for Intech Emails
            </label>
            <input
              type="text"
              className="mt-2 w-full max-w-96 rounded-lg p-2 text-lg"
              placeholder="Enter your email address"
            />
          </div>
        </div>
      </div>
      {/* Social media section */}
      <div className="mx-auto flex w-[70%] max-w-96 justify-between md:mb-5 md:mt-9">
        <FaInstagram className="h-[2.25rem] w-[2.25rem] rounded-full bg-white p-1 text-navy" />
        <FaFacebook className="text-4xl" />
        <FaTiktok className="h-[2.25rem] w-[2.25rem] rounded-full bg-white p-1 text-navy" />
        <FaYoutube className="h-[2.25rem] w-[2.25rem] rounded-full bg-white p-1 text-navy" />
        <FaTwitter className="h-[2.25rem] w-[2.25rem] rounded-full bg-white p-1 text-navy" />
      </div>

      <div className="mx-auto mt-3 w-fit">
        <img src={onclik} alt="onclik logo" />
      </div>
    </footer>
  )
}

export default ClientFooter

import { useIsMobile } from "../../hooks/useIsMobile"

const LaptopSkeleton = () => {
  const isMobile = useIsMobile()
  return (
    <div className="p-3 font-baloo">
      {isMobile ? (
        <section className="flex w-full flex-col items-center">
          <div className="mb-3 h-6 w-60 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for laptop brand, model, screen size, etc. */}
          </div>

          <div className="relative w-full p-3">
            <div className="h-40 w-full animate-pulse rounded-lg bg-gray-300">
              {/* Placeholder for laptop images slider */}
            </div>

            <div className="absolute bottom-0 mt-2 flex w-full justify-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
            </div>
          </div>

          <div className="my-3 h-8 w-60 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for One-Time Payment Price */}
          </div>

          <div className="mb-3 h-8 w-60 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for Financing Payment Details */}
          </div>

          <div className="mt-3 h-4 w-80 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for laptop description */}
          </div>
        </section>
      ) : (
        <section className="flex items-center justify-center gap-x-10">
          <div className="flex w-fit flex-col gap-y-4">
            <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-300"></div>
            <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-300"></div>
            <div className="h-20 w-20 animate-pulse rounded-lg bg-gray-300"></div>
          </div>

          <div className="h-72 w-72 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for the selected laptop image */}
          </div>

          <div className="w-80">
            <div className="mb-3 h-6 w-60 animate-pulse rounded-lg bg-gray-300">
              {/* Placeholder for laptop details */}
            </div>

            <div className="my-3 h-8 w-52 animate-pulse rounded-lg bg-gray-300">
              {/* Placeholder for One-Time Payment & Financing */}
            </div>

            <div className="mt-3 h-4 w-80 animate-pulse rounded-lg bg-gray-300">
              {/* Placeholder for laptop description */}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-5 md:flex md:justify-center">
        <div className="mb-4 md:w-[30rem] lg:w-[45rem]">
          <div className="mb-4 h-6 w-40 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for 'Customize' title */}
          </div>

          <div className="mt-5 h-8 w-full animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for screen size options */}
          </div>

          <div className="mt-5 h-8 w-full animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for processor options */}
          </div>

          <div className="mt-5 h-8 w-full animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for RAM options */}
          </div>

          <div className="mt-5 h-8 w-full animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for storage options */}
          </div>

          <div className="mt-5 h-8 w-full animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for graphic card options */}
          </div>
        </div>

        <div className="mt-6 pl-5">
          <div className="mb-4 h-10 w-40 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for delivery options */}
          </div>

          <div className="mb-4 h-12 w-80 animate-pulse rounded-lg bg-gray-300">
            {/* Placeholder for Add to Cart button */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LaptopSkeleton

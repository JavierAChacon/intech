import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import fetchLaptop from "../../utils/fetchLaptop"
import type { LaptopInformation } from "../../utils/fetchLaptop"

const Laptop = () => {
  const { id: laptopId } = useParams()
  const [laptop, setLaptop] = useState<LaptopInformation | null>()

  useEffect(() => {
    const fetchData = async () => {
      if (laptopId) {
        const fetchedLaptop = await fetchLaptop(laptopId)
        setLaptop(fetchedLaptop)
      }
    }

    fetchData()
  }, [laptopId])

  console.log(laptop)

  return (
    <div>
      <h1>Laptop</h1>
    </div>
  )
}

export default Laptop

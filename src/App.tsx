import { useState, useEffect } from 'react'

import Autocomplete from './components/Autocomplete'

interface Options {
  name: string
  url: string
}

const App = () => {
  const [optionsData, setOptionsData] = useState<Options[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0')
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        const data = await response.json()
        setOptionsData(data.results.sort((a: Options, b: Options) => a.name.localeCompare(b.name)))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const onClick = (value: string) => {
    alert(`Selected: ${value}`)
  }

  return (
    <>
      <h1>Deel</h1>
      <Autocomplete options={optionsData} isLoading={isLoading} onSelect={onClick} />
    </>
  )
}

export default App

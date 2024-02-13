import React, { useMemo, useState, ChangeEvent, KeyboardEvent } from 'react'

import './styles.css'

interface OptionsProps {
  name: string
  url: string
}

type AutocompleteProps = {
  options: OptionsProps[];
  isLoading: boolean;
  onSelect: (value: string) => void
}

const Autocomplete = ({ options, isLoading, onSelect }: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<OptionsProps[]>([])
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value
    const filteredOptions = options.filter(item => item?.name.toLowerCase().indexOf(typedValue.toLowerCase()) > -1)
    setInputValue(typedValue)
    setFilteredOptions(filteredOptions)
    setShowOptions(true)
  }

  const onMouseDown = () => {
    setShowOptions(true)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 27) {
      setShowOptions(false)
    }
  }

  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onSelect(e.currentTarget.innerText)
    setShowOptions(false)
    setInputValue(e.currentTarget.innerText)
  }

  /*
  * RENDER OPTIONS
  */
  let optionsData = options
  if (inputValue?.length > 0) {
    optionsData = filteredOptions
  }

  const renderOptions = useMemo(() => {
    return <ul className='autocomplete-options'>
      {optionsData?.length > 0 ? optionsData?.map((item) => {
        const startIndex = item.name.toLowerCase().indexOf(inputValue.toLowerCase())
        const endIndex = startIndex + inputValue.length

        return (
          <li key={item.name} onClick={onClick} value={item.name}>
            {startIndex > -1 ? (
              <>
                {item.name.substring(0, startIndex)}
                <span className='option-active'>{item.name.substring(startIndex, endIndex)}</span>
                {item.name.substring(endIndex)}
              </>
            ) : (
              item.name
            )}
          </li>
        )
      }) :
        <li>No data found</li>}
    </ul>
  }, [optionsData, inputValue])

  return (
    <div className='autocomplete-container'>
      <input
        className='autocomplete-input'
        disabled={isLoading}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        placeholder='Type to search...'
        type='text'
        value={inputValue}
      />
      {showOptions && renderOptions}
    </div>
  )
}

export default Autocomplete

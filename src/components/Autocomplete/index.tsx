import React, { useMemo, useRef, useEffect, useState, ChangeEvent, KeyboardEvent } from 'react'

import './styles.css'

interface OptionsProps {
  name: string
  url: string
}

type AutocompleteProps = {
  options: OptionsProps[] | null | undefined;
  isLoading: boolean;
  onSelect: (value: string) => void
}

const Autocomplete = ({ options, isLoading, onSelect }: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<OptionsProps[]>([])
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0)

  const autocompleteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value
    const filteredOptions = options?.filter(item => item?.name.toLowerCase().indexOf(typedValue.toLowerCase()) > -1) || []
    setInputValue(typedValue)
    setFilteredOptions(filteredOptions)
    setShowOptions(true)
    setActiveOptionIndex(-1)
  }

  const onMouseDown = () => {
    setShowOptions(true)
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
      {optionsData && optionsData?.length > 0 ? optionsData?.map((item, index) => {
        const startIndex = item.name.toLowerCase().indexOf(inputValue.toLowerCase())
        const endIndex = startIndex + inputValue.length

        return (
          <li
            className={index === activeOptionIndex ? 'active' : ''}
            key={item.name}
            onClick={onClick}
            value={item.name}
          >
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
        <li>No results found</li>
      }
    </ul>
  }, [optionsData, inputValue, activeOptionIndex])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setActiveOptionIndex(prevIndex => (prevIndex - 1 + (optionsData?.length ?? 1)) % (optionsData?.length ?? 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveOptionIndex(prevIndex => (prevIndex + 1) % (optionsData?.length ?? 1))
        break
      case 'Enter':
        if (activeOptionIndex !== -1) {
          e.preventDefault()
          if (optionsData?.length) {
            onSelect(optionsData[activeOptionIndex].name)
            setInputValue(optionsData[activeOptionIndex].name)
          }
          setShowOptions(false)
        }
        break
      case 'Escape':
        setShowOptions(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={autocompleteRef} className='autocomplete-container'>
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

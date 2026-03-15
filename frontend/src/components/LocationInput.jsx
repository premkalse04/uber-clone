import React, { forwardRef } from 'react'

const LocationInput = forwardRef(({
    value, onChange, onFocus, onBlur,
    placeholder, icon, rightSlot,
    id, disabled, className = ''
}, ref) => {
    return (
        <div className={`relative flex items-center bg-gray-100 rounded-xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:bg-white border border-transparent focus-within:border-gray-200 transition-all duration-150 ${className}`}>
            {/* Left icon */}
            <span className='flex-shrink-0 select-none'>{icon}</span>

            {/* Input */}
            <input
                ref={ref}
                id={id}
                type='text'
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete='off'
                className='flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none min-w-0'
            />

            {/* Right slot (optional icon/button) */}
            {rightSlot && <span className='flex-shrink-0'>{rightSlot}</span>}
        </div>
    )
})

LocationInput.displayName = 'LocationInput'
export default LocationInput

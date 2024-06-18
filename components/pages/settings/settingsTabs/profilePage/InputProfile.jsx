import React from 'react'

export default function InputProfile({
    id,
    onChange,
    name,
    type,
    value,
    className,
    disabled = false,
    errors,
    placeholder,
    refClear,
}) {
    return (
        <div className="relative">
            <input
                ref={refClear}
                id={id}
                onChange={onChange}
                className={className}
                name={name}
                type={type}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
            />
            {errors && (
                <div className="absolute bottom-1 text-[#fa4d56] text-[13px]">
                    {errors}
                </div>
            )}
        </div>
    )
}

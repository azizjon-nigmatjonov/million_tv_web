import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'

const PasswordInput = ({
    onChange,
    name,
    classes,
    value,
    rest,
    placeholder,
    errors,
}) => {
    const [showPassword, setShowPassword] = useState(false)

    let hasError
    if (errors) {
        hasError = errors.password
    }

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full h-14 border rounded focus:outline-none px-5 ${
                    classes && classes
                }`}
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-4"
            >
                {showPassword ? (
                    <EyeOffIcon className="w-5 text-gray-400" />
                ) : (
                    <EyeIcon
                        className={`w-5 ${
                            hasError ? 'text-brand-red' : 'text-gray-400'
                        }`}
                    />
                )}
            </button>
        </div>
    )
}

export default PasswordInput

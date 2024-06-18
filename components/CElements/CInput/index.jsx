import { useDebounce } from 'hooks/useDebounce'
import { useTranslation } from 'i18n'
import { useEffect, useState } from 'react'

export default function CInput({
    classes,
    classesInput,
    icon,
    name = '',
    type = 'text',
    label = '',
    defaultValue = '',
    placeholder = '',
    setValue = () => {},
    debounceTime = 0,
    errors = {},
    props,
}) {
    const { t } = useTranslation()
    const [text, setText] = useState('')

    const debouncedValue = useDebounce(text, debounceTime)

    useEffect(() => {
        setValue(name, debouncedValue)
    }, [debouncedValue, name, setValue])

    return (
        <div className="w-full relative">
            {label ? <p className="text-dark mb-1 font-bold">{label}</p> : ''}
            <div
                className={`h-[48px] flex items-center overflow-hidden px-[14px] bg-mainColor rounded-[12px] ${
                    errors[name] ? 'border border-error' : ''
                } ${classes}`}
            >
                {icon}
                <input
                    type={type}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    className={`w-full h-full outline-none text-dark bg-transparent ${classesInput} `}
                    {...props}
                />
            </div>
            {errors[name]?.message && (
                <p className="text-error text-sm">{t(errors[name].message)}</p>
            )}
        </div>
    )
}

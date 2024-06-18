import CError from 'components/CElements/CError'
import CLabel from 'components/CElements/CLabel'
import { useEffect, useRef } from 'react'

function TextInput({
    label,
    type,
    errors,
    id,
    handleChange,
    name,
    additionalClasses = '',
    touched,
    ...rest
}) {
    const refFocus = useRef()
    useEffect(() => {
        refFocus.current.focus()
    }, [])

    return (
        <div className="relative flex-col text-medium">
            {label && <CLabel title={label} />}
            <input
                ref={refFocus}
                onChange={handleChange}
                className={` textColor w-full rounded-lg bg-blackDark focus:outline-none focus:border-transparent p-4 font-medium
                 ${additionalClasses}`}
                // style={{ border: errors?.[name] ? '1px solid red' : '' }}
                name={name}
                type={type}
                {...rest}
            />
            {/* <CError name={name} errors={errors} /> */}
        </div>
    )
}

export default TextInput
